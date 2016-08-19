import Config from './config.js';
import {initLoginService} from './login.js';
import {initAppEventService} from './app_event.js';
import {initMiscService} from './misc.js';
import {initChallengeService} from './challenge.js';
import {initShareService} from './share.js';
import {initPersistenceService} from './persistence.js';
import {initGraphService} from './graph_api.js';
import {initLogService} from './log.js';
import {initPermissionService} from './permission.js';
import {initNotificationService} from './notifications.js';
import {initAchievementService} from './achievement.js';


const GraphAPIVersion = 'v2.7';


function ready() {
   FB.init({
    appId: Config.appId,
    frictionlessRequests: true,
    status: true,/*每次页面加载都重新获取登录状态*/
    version: GraphAPIVersion
  });
}

export function setParams(params) {
  Object.keys(params).forEach((k)=>{
    if(!Config.hasOwnProperty(k)) {
      console.error("invalid init params: ", k);
      console.error("valid params: ", Object.keys(Config));
    }
    else {
      Config[k] = params[k];
    }
  });

  return;
}

export function init() {
  var FB = {};

  if(typeof FB === 'undefined') {
    console.error("not loaded facebook SDK");
    return;
  }

  ready();

  initLogService();

  initMiscService();

  initPermissionService();

  initGraphService();
  
  initLoginService();

  initNotificationService();

  initShareService();

  initAppEventService();

  initAchievementService();

  initChallengeService();

  initPersistenceService();

  return;
}