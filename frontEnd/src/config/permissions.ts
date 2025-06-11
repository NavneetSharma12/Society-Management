
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
  'reports.download',
  'society.view',
  'society.create',
  'society.edit',
  'society.delete',
  'society.view_all',
  'staff.view',
  'staff.create',
  'staff.edit',
  'staff.delete'
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
    'reports.view',
    'society.view',
    'staff.view',
    'staff.create',
    'staff.edit'
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
  'reports.download': 'Download Reports',
  'society.view': 'View Society',
  'society.create': 'Create Society',
  'society.edit': 'Edit Society',
  'society.delete': 'Delete Society',
  'society.assign_admin': 'Assign Admin',
  "society.edit_admin": "Edit Admin",
  'society.view_all': 'View All Societies',
  'staff.view': 'View Staff',
  'staff.create': 'Create Staff',
  'staff.edit': 'Edit Staff',
  'staff.delete': 'Delete Staff'
};
