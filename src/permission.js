import {getServiceManager} from './service_manager.js';

const serviceManager = getServiceManager();

function PermissionService() {
  this.grantedPermissions = null;
}

PermissionService.prototype.hasPermission = function(type) {
  return this.grantedPermissions && 
    this.grantedPermissions.some((iter) => {
      return iter.status === 'granted' && type === iter.permission;
  });
};

PermissionService.prototype.setGrantedPermissions = function(permissions) {
  this.grantedPermissions = JSON.parse(JSON.stringify(permissions));
};

export function initPermissionService() {
  let service = new PermissionService();
  serviceManager.registerService('permission', service);
}