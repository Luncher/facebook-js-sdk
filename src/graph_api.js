
import {getServiceManager} from './service_manager.js';


function GraphAPIService() {
  this.appRequest = new GraphAPIService.AppRequest(this);
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

//AppRequest
GraphAPIService.AppRequest = function(graphServiceInst) {
  this.graphServiceInst = graphServiceInst;
};

GraphAPIService.AppRequest.prototype.get = function(appRequestId) {
  return this.graphServiceInst.makeGraphAPIRequest('/'+appRequestId);
};

GraphAPIService.AppRequest.prototype.post = function(userId, options) {
  return this.graphServiceInst.makeGraphAPIRequest('/' + userId + '/apprequests', options, 'POST');
};

GraphAPIService.AppRequest.prototype.delete = function(appRequestId) {
  return this.graphServiceInst.makeGraphAPIRequest('/'+appRequestId, '', 'DELETE');
};

//User API
GraphAPIService.prototype.userFeed = function(userid, options) {
  let endpoint = '/' + userid + '/feed';
  return this.makeGraphAPIRequest(endpoint, options);
};

export function initGraphService() {
  let service = new GraphAPIService();
  getServiceManager().registerService('graph', service);
}