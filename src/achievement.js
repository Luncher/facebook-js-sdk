import Config from './config.js';
import {getServiceManager} from './service_manager.js';


const serviceManager = getServiceManager();
let graphService = null;
let permissionService = null;

/**
 * https://developers.facebook.com/docs/games/services/scores-achievements
 * https://developers.facebook.com/docs/graph-api/reference/v2.7/app/scores
 */

function Achievement() {
}

Achievement.prototype.getUserScore = function(userid, callback) {
  if(typeof userid === 'function') {
    callback = userid;
    userid = 'me';
  }
  let endpoint = '/' + userid + '/scores';

  graphService.normalRequest(endpoint)
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.postUserScore = function(userid, score, callback) {
  let options = {score};

  if(typeof score === 'function') {
    callback = score;
    score = userid;
    userid = 'me';
    options = {score};
  }
  let endpoint = '/' + userid + '/scores';

  graphService.normalRequest(endpoint, options, 'POST')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.deleteUserScore = function(userid, callback) {
  if(typeof userid === 'function') {
    callback = userid;
    userid = 'me';
  }
  let endpoint = '/' + userid + '/scores';

  graphService.normalRequest(endpoint, '', 'DELETE')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.listAppScore = function (callback) {
  let endpoint = '/' + Config.appId + '/scores';

  graphService.normalRequest(endpoint)
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.clearAppScore = function(callback) {
  let endpoint = '/' + Config.appId + '/scores';

  graphService.normalRequest(endpoint, '', 'DELETE')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

//achievement
Achievement.prototype.createAchievement = function(achieventId, callback) {
  let options = {
    achievement: achieventId
  };

  graphService.privateRequest('achievements', options, 'POST')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.getUserAchievement = function(callback) {
  graphService.privateRequest('achievements')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

Achievement.prototype.deleteUserAchievement = function(achieventId, callback) {
  let options = {
    achievement: achieventId
  };

  graphService.privateRequest('achievements', options, 'DELETE')
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

export function initAchievementService() {
  let service = new Achievement();

  serviceManager.registerService('achievement', service);
  permissionService = serviceManager.getService('permission');
  graphService = serviceManager.getService('graph');
}