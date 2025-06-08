
import { Permission, RolePermissions } from '../types/permissions';

export const ALL_PERMISSIONS: Permission[] = [
  'dashboard.view',
  'residents.view',
  'residents.create',
  'residents.edit',
  'residents.delete',
  'requests.view',
  'requests.approve',
  'requests.reject',
  'permissions.view',
  'permissions.edit',
  'activity.view',
  'notifications.view',
  'notifications.create',
  'reports.view',
  'reports.download'
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  super_admin: ALL_PERMISSIONS,
  admin: [
    'dashboard.view',
    'residents.view',
    'residents.create',
    'residents.edit',
    'requests.view',
    'requests.approve',
    'requests.reject',
    'activity.view',
    'notifications.view',
    'reports.view'
  ]
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  'dashboard.view': 'View Dashboard',
  'residents.view': 'View Residents',
  'residents.create': 'Create Residents',
  'residents.edit': 'Edit Residents',
  'residents.delete': 'Delete Residents',
  'requests.view': 'View Requests',
  'requests.approve': 'Approve Requests',
  'requests.reject': 'Reject Requests',
  'permissions.view': 'View Permissions',
  'permissions.edit': 'Edit Permissions',
  'activity.view': 'View Activity',
  'notifications.view': 'View Notifications',
  'notifications.create': 'Create Notifications',
  'reports.view': 'View Reports',
  'reports.download': 'Download Reports'
};
