
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
  | 'reports.download'
  | 'society.view'
  | 'society.create'
  | 'society.edit'
  | 'society.delete'
  | 'society.view_all'
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete';

export type Role = 'super_admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  societyId?: string;
  societyName?: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}
