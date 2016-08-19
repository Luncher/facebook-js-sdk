import test from 'ava';
import {getServiceManager} from '../src/service_manager.js';

test('getServiceManager must be an function', t => {
  t.truthy(typeof getServiceManager === 'function', "typeof getServiceManager fail");
});

test('should allow getServiceManager', t => {
  t.truthy(typeof getServiceManager() === 'object', 'getServiceManager fail');
  t.truthy(typeof getServiceManager().getService === 'function', 'getServiceManager fail');
});

test('show allow register service', t => {
  const obj = {};
  const serviceManager = getServiceManager();
  serviceManager.registerService('obj', obj);
  t.is(serviceManager.getService('obj'), obj, "should allow register service");
});