import {getServiceManager} from './service_manager.js';

let logService = null;
let miscService = null;
let graphService = null;
let permissionService = null;
const serviceManager = getServiceManager();

function ChallengeService() {
  this.challengeResp = {};
  this.invatiableResp = null;
}

function makeRquest(options) {
  if(!options.method) {
    options.method = 'apprequests';
  }
  return new Promise(function(resolve, reject) {
    FB.ui(options, function(resp) {
      if(resp && resp.error) {
        reject(resp.error);
      }
      else {
        resolve(resp);
      }
    });
  });
}

ChallengeService.prototype.sendAppRequest = function(userid, message, callback) {
  let options = {message, action_type: 'TURN'};

  graphService.appRequest.post(userid, options)
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });
};

// yinlijun 267718550281468
ChallengeService.prototype.send = function(to, message, callback, action_type) {
  let that = this;
  let options = {};

  if(to) {
    options.to = to;
  }

  if(message) {
    options.message = message;
  }

  if(action_type) {
    options.action_type = action_type;
  }

  makeRquest(options)
  .then(function(resp) {
    //cache request
    that.challengeResp[resp.request] = null;
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

/**
 * https://developers.facebook.com/docs/games/services/gamerequests
 */
ChallengeService.prototype.sendCustomize = function(to, message, callback) {
  let that = this;
  let options = {};

  if(Array.isArray(to)) {
    to = to.join(',');
  }
  options.to = to;
  options.message = message;

  makeRquest(options)
  .then(function(resp) {
    //cache request
    that.challengeResp[resp.request] = null;
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};


/**
 * https://developers.facebook.com/docs/games/services/gamerequests
 */
ChallengeService.prototype.query = function(id, options, callback) {
  let that = this;
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }

  if(!options.fields) {
    options.fields = 'from{id,name,picture}';
  }

  graphService.normalRequest(String(id), options)
  .then(function(resp) {
    that.challengeResp[resp.id] = resp;    
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

ChallengeService.prototype.delete = function(id, callback) {
  if(!this.challengeResp[id]) {
    logService.warn("delete not exists challenge request: ", id);
  }

  delete this.challengeResp[id];
  graphService.normalRequest(String(id), undefined, 'delete')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

ChallengeService.prototype.getChallengeCache = function(id) {
  return this.challengeResp[id];
};

ChallengeService.prototype.getinvitableFriendsCache = function() {
  return this.invatiableResp;
};

ChallengeService.prototype.invitableFriends = function(callback) {
  let that = this;

  if(!permissionService.hasPermission('user_friends')) {
    miscService.asyncCallback(new Error("need user_friends permission"), callback);
    return;
  }

  graphService.privateRequest('invitable_friends')
  .then(function(resp) {
    that.invatiableResp = resp;
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

export function initChallengeService() {
   let service = new ChallengeService();
   serviceManager.registerService('challenge', service);

   logService = serviceManager.getService('log');
   miscService = serviceManager.getService('misc');
   graphService = serviceManager.getService('graph');
   permissionService = serviceManager.getService('permission');
}