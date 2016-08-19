import {getServiceManager} from './service_manager.js';


export const LOGLEVEL = {
  DEBUG: -1,
  NORMAL: 0,
  WARN:   1,
  ERROR:  2
};

function LogService() {
  this.logLevel = LOGLEVEL.NORMAL;
}

LogService.prototype.validLog = function(level) {
  return level > this.logLevel ? true : false;
};

LogService.prototype.setLogLevel = function(level) {
  this.logLevel = level;
};

LogService.prototype.debug = function() {
  if(this.validLog(LOGLEVEL.DEBUG)) {
    let args = [].slice.call(arguments);
    console.debug("#debug#:%s", args.join("\n"));
  }
};

LogService.prototype.error = function() {
  if(this.validLog(LOGLEVEL.ERROR)) {
    let args = [].slice.call(arguments);
    console.debug("#error#:%s", args.join("\n"));
  }
};

LogService.prototype.warn = function() {
  if(this.validLog(LOGLEVEL.WARN)) {
    let args = [].slice.call(arguments);
    console.debug("#warn #:%s", args.join("\n"));
  }
};

export function initLogService() {
  let service = new LogService();
  getServiceManager().registerService('log', service);
}