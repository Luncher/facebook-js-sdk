import {getServiceManager} from './service_manager.js';

const serviceManager = getServiceManager();

function AppEventService() {

}

AppEventService.prototype.logEvent = function(eventName, valueToSum, parameters) {
  FB.AppEvents.logEvent(eventName, valueToSum, parameters);  
};

AppEventService.prototype.logPurchase = function(purchaseAmount, currency, parameters) {
  FB.AppEvents.logPurchase(purchaseAmount, currency, parameters);    
};


// export function logAchievedLevel(level) {
//   var params = {};
//   params[FB.AppEvents.ParameterNames.LEVEL] = String(level);
//   FB.AppEvents.logEvent(
//     FB.AppEvents.EventNames.ACHIEVED_LEVEL,
//     null,  // numeric value for this event - in this case, none
//     params
//   );
// }

// export function logGamePlayedEvent(score) {
//   var params = {
//     'score': score
//   };
//   FB.AppEvents.logEvent('game_played', null, params);
// }

export function initAppEventService() {
  let service = new AppEventService();
  serviceManager.registerService('app_event', service);
}