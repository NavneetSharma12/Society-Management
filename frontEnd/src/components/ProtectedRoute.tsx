
import React from 'react';
import { Card, Typography, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { Permission } from '../types/permissions';

const { Title, Text } = Typography;

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const hasPermission = (perm: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(perm);
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    if (!user) return false;
    return perms.some(p => hasPermission(p));
  };

  const hasAccess = () => {
    if (permission) {
      return hasPermission(permission);
    }
    
    if (permissions.length > 0) {
      return requireAll 
        ? permissions.every(p => hasPermission(p))
        : hasAnyPermission(permissions);
    }
    
    return true;
  };

  if (!hasAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <LockOutlined className="text-2xl text-red-600" />
          </div>
          <Title level={3} className="!text-red-600">Access Denied</Title>
          <Text className="text-slate-600 max-w-md">
            You don't have permission to access this section. Please contact your administrator if you believe this is an error.
          </Text>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
