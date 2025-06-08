
export type Permission = 
  | 'dashboard.view'
  | 'residents.view'
  | 'residents.create'
  | 'residents.edit'
  | 'residents.delete'
  | 'requests.view'
  | 'requests.approve'
  | 'requests.reject'
  | 'permissions.view'
  | 'permissions.edit'
  | 'activity.view'
  | 'notifications.view'
  | 'notifications.create'
  | 'reports.view'
  | 'reports.download';

export type Role = 'super_admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}
