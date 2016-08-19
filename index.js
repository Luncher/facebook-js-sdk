import {setParams, init} from './src/startup.js';
import {getServiceManager} from './src/service_manager.js';


global.HolaFacebook = {
  initSdk,
  setParams
};

let inited = false;

function initSdk() {
  if(inited) {
    return;
  }

  inited = true;
  init();
  const serviceManager = getServiceManager();
  serviceManager.listAllServices().forEach((serviceKey) => {
    let service = serviceManager.getService(serviceKey);
    global.HolaFacebook[serviceKey] = service;
  });
}

