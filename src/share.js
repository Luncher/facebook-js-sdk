
import Config from './config.js';
import {getServiceManager} from './service_manager.js';

const serviceManager = getServiceManager();
let logService = null;
let miscService = null;
let graphAPIService = null;
let permissionService = null;

function ShareService() {

}

ShareService.prototype.makeShare = function(method, params, callback) {
  params.method = method;
  FB.ui(params, function(resp) {
    if(resp && !resp.error_message) {
      callback(null, resp);
    }
    else {
      callback(resp.resp.error_message);
    }
  });
};

/*
  https://developers.facebook.com/docs/games/services/sharing
  https://developers.facebook.com/docs/sharing/reference/share-dialog
 */
ShareService.prototype.shareUI = function(params, callback) {
  if(typeof params === 'function') {
    callback = params;
    params = {};
  }

  if(!('href' in params)) {
    params.href = Config.serverURL;
  }

  this.makeShare('share', params, callback);

  return;
};


/**
 * https://developers.facebook.com/docs/sharing/reference/feed-dialog
 */
ShareService.prototype.shareFeed = function(params, callback) {
  if(typeof params === 'function') {
    callback = params;
    params = {};
  }

  if(!params.appName) {
    params.name = Config.appName;
  }

  if(!params.link) {
    params.link = Config.serverURL;
  }

  if(!params.appDesc) {
    params.description = Config.appDesc;
  }

  this.makeShare('feed', params, callback);

  return;
};

/**
 * https://developers.facebook.com/docs/sharing/reference/send-dialog
 */
ShareService.prototype.shareMessage = function(params, callback) {
  if(typeof params === 'function') {
    callback = params;
    params = {};
  }
  
  if(!params.link) {
    params.link = Config.serverURL;
  }

  this.makeShare('send', params, callback);

  return;
};

/**
 * https://developers.facebook.com/docs/sharing/reference/share-dialog
 * https://developers.facebook.com/docs/sharing/opengraph/using-actions
 * 需要审核
 */
ShareService.prototype.shareOpenGraph = function(type, properties, callback) {
  let params = {};

  params.action_type = type;
  parent.action_properties = properties;

  this.makeShare('share_open_graph', params, callback);

  return;
};

/**
 * https://developers.facebook.com/docs/games/services/sharing
 * https://developers.facebook.com/docs/sharing/opengraph/using-actions
 */
ShareService.prototype.shareByCustomize = function(action_type, params, callback) {
  if(!params['fb:explicitly_shared']) {
    params['fb:explicitly_shared'] = true;
  }

  if(!permissionService.hasPermission('publish_actions')) {
    logService.error("shareByCustomize permission denied");
    miscService.asyncCallback(new Error("permission denied"), callback);
    return;
  }

  graphAPIService.shareMessage(action_type, params)
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

export function initShareService() {
  let service = new ShareService();
  serviceManager.registerService('share', service);
  graphAPIService = serviceManager.getService('graph');
  logService = serviceManager.getService('log');
  miscService = serviceManager.getService('misc');
  permissionService = serviceManager.getService('permission');

  return;
}