import {getServiceManager} from './service_manager.js';

const serviceManager = getServiceManager();
let miscService  = null;
let graphService = null;


function NotificationService() {
}

NotificationService.prototype.send = function(id, template, callback) {
  let options = {};

  if(template.length > 180) {
    miscService.asyncCallback(new Error("tmplate too long"), callback);
    return;
  }

  options.template = template;

  let endpoint = '/' + id + '/notifications';
  graphService.normalRequest(endpoint, options)
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    callback(err);
  });

  return;
};

export function initNotificationService() {
  let service = new NotificationService();
  serviceManager.registerService('notification', service);
  miscService = serviceManager.getService('misc');
  graphService = serviceManager.getService('graph');
}