let debug = require('debug')('services_manager');

function ServiceManager() {
  this.servicesHandlers = {};
}

ServiceManager.prototype.registerService = function(id, handler) {
  if(id in this.servicesHandlers) {
    debug('override registerService:' + id);
  }
  this.servicesHandlers[id] = handler;

  return this;
};

ServiceManager.prototype.getService = function(id) {
  if(!(id in this.servicesHandlers)) {
    debug('override registerService:' + id);    
  }

  return this.servicesHandlers[id];
};

ServiceManager.prototype.listAllServices = function() {
  return Object.keys(this.servicesHandlers);
};

let servicesManager = null;

export function getServiceManager() {
  if(!servicesManager) {
    servicesManager = new ServiceManager();
  }

  return servicesManager;
}