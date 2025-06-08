
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission, Role } from '../types/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';

interface PermissionContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  isRole: (role: Role) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserPermissions: (userId: string, permissions: Permission[]) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock users for demo - replace with your backend API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Super Admin',
      email: 'super@admin.com',
      role: 'super_admin',
      permissions: DEFAULT_ROLE_PERMISSIONS.super_admin
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@admin.com',
      role: 'admin',
      permissions: DEFAULT_ROLE_PERMISSIONS.admin
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const isRole = (role: Role): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with your backend API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'admin123') {
      setUser(foundUser);
      localStorage.setItem('admin_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        user,
        hasPermission,
        hasAnyPermission,
        isRole,
        login,
        logout,
        updateUserPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
