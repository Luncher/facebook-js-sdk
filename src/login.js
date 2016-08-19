import {_extend as extend} from 'util';
import {getServiceManager} from './service_manager.js';


let logService = null;
let miscService = null;
let permissionService = null;

const serviceManager = getServiceManager();

const LoginStatus = {
  connected: 'connected',
  not_authorized: 'not_authorized',
  unknown: 'unknown'
};

function LoginService() {
  this.userStatus = {
    status: LoginStatus.unknown,
    authResponse: null,
    profile: null
  };
}

LoginService.prototype.login = function(options, callback) {
  const that = this;
  let logService = serviceManager.getService('log');
  
  if(arguments.length === 1) {
    callback = options;
    options = {};
  }

  if(this.userStatus.status === LoginStatus.connected) {
    miscService.asyncCallback(null, this.userStatus, callback);
    logService.debug('already logined');
    return;
  }

  options = extend(options, {return_scopes: true});
  FB.login(function(response) {
    if(response.status === 'connected') {
      that.userStatus.status = response.status;
      that.userStatus.authResponse = response;
      callback(null, response);
    }
    else {
      callback(response);
    }
  }, options);
};

LoginService.prototype.logout = function(callback) {
  const that = this;

  FB.logout(function(resp) {
    that.userStatus.status = LoginStatus.unknown; 
    if(resp.error) {
      logService("logout fail", resp.error);
    }
    callback(resp);
  });
};

LoginService.prototype.isLogined = function() {
  return this.userStatus.status === LoginStatus.connected;
};

LoginService.prototype.getUserProfile = function(userid, options, callback) {
  const that = this;
  let graphService = null;

  if(this.userStatus.status !== LoginStatus.connected) {
      let err = new Error("not logined");
      miscService.asyncCallback(err, callback);  
      return;  
  }

  if(typeof options === 'function') {
    callback = options;
    options = {fields: 'id,name,first_name,picture.width(120).height(120)'};
  }  
  else if(typeof userid === 'function') {
    callback = userid;
    userid = null;
    options = {fields: 'id,name,first_name,picture.width(120).height(120)'};    
  }

  graphService = serviceManager.getService('graph');
  
  if(this.userStatus.status === LoginStatus.connected && 
    this.userStatus.profile && userid === null) {
      miscService.asyncCallback(null, this.userStatus.profile, callback);
      return;
  }

  graphService.getUserProfile(userid, options)
  .then(function(resp) {
    that.userStatus.profile = resp;
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });
  
  return this.userStatus;
};

LoginService.prototype.getAuthResponse = function() {
  return this.userStatus.authResponse;
};

LoginService.prototype.setAuthResponse = function(resp) {
  this.userStatus.authResponse = resp.authResponse;
};

LoginService.prototype.setUserStatus = function(status) {
  this.userStatus.status = status;
};

function onAuthResponseChange(response) {
  if(response.status === 'connected') {
    let logService = serviceManager.getService('log');
    let loginService = serviceManager.getService('login');
    let graphService = serviceManager.getService('graph');

    loginService.setUserStatus('connected');
    loginService.setAuthResponse(response);
    graphService.getGrantedPermissions()
    .then(function(resp) {
      permissionService.setGrantedPermissions(resp.data);
    })
    .catch(function(err) {
      logService.error(err);
    });
  }
}

function onStatusChange(response) {
  if(response.status !== 'connected') {
    let loginService = serviceManager.getService('login');    
    loginService.setUserStatus(response.status);
  }

  return;
}

export function initLoginService() {
  let service = new LoginService();
  serviceManager.registerService('login', service);
  logService = serviceManager.getService('log');
  miscService = serviceManager.getService('misc');  
  permissionService = serviceManager.getService('permission');

  FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange);
  FB.Event.subscribe('auth.statusChange', onStatusChange);
}