

import {getServiceManager} from './service_manager.js';

const serviceManager = getServiceManager();


function MiscService() {

}

MiscService.prototype.asyncCallback = function(err, ret, callback) {
  if(typeof err === 'function') {
    callback = err;
    err = undefined;
  }
  else if(typeof ret === 'function') {
    callback = ret;
    ret = undefined;
  }

  setTimeout(function() {
    callback(err, ret);
  }, 0);

  return;
};


function urlHandler() {

}

export function initMiscService() {
  let service = new MiscService();

  serviceManager.registerService('misc', service);
  
  FB.Canvas.setDoneLoading();
  FB.Canvas.setUrlHandler(urlHandler);
}