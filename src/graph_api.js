
import {getServiceManager} from './service_manager.js';


function GraphAPIService() {

}

GraphAPIService.prototype.makeGraphAPIRequest = function(endpoint, options, action) {
  action = action || 'GET';
  return new Promise(function(resolve, reject) {
    options = options || {};
    FB.api(endpoint, action, options, function(response) {
      if(response.error) {
        reject(response.error);
      }
      else {
        resolve(response);
      }
    });
  });
};

GraphAPIService.prototype.getGrantedPermissions = function() {
  return this.makeGraphAPIRequest('/me/permissions');
};

GraphAPIService.prototype.getUserProfile = function(userid, params) {
  userid = userid || '/me';
  if(!/^\//.test(userid)) {
    userid = '/' + userid;
  }  
  return this.makeGraphAPIRequest(userid, params);
};

GraphAPIService.prototype.shareMessage = function(actionType, params) {
  let endpoint = '/me/' + actionType;
  return this.makeGraphAPIRequest(endpoint, params, 'POST');
};

GraphAPIService.prototype.normalRequest = function(endpoint, options, action) {
  return this.makeGraphAPIRequest(endpoint, options, action);
};

GraphAPIService.prototype.privateRequest = function(edge, options, action) {
  let endpoint = '/me/' + edge;
  return this.makeGraphAPIRequest(endpoint, options, action);
};

export function initGraphService() {
  let service = new GraphAPIService();
  getServiceManager().registerService('graph', service);
}