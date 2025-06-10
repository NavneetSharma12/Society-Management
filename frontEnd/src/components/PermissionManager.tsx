import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Select, Checkbox, Typography, Space, Tag } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { Permission, Role } from '../types/permissions';
import { ALL_PERMISSIONS, PERMISSION_LABELS, DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

const PermissionManager: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form] = Form.useForm();

  const isRole = (role: Role): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  // Mock admin users - replace with your backend API
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
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
  ]);

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
  };

  const handleEditPermissions = (adminUser: AdminUser) => {
    setEditingUser(adminUser);
    form.setFieldsValue({
      role: adminUser.role,
      permissions: adminUser.permissions
    });
    setIsModalVisible(true);
  };

  const handleRoleChange = (role: Role) => {
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role];
    form.setFieldsValue({ permissions: defaultPermissions });
  };

  const handleSave = (values: { role: Role; permissions: Permission[] }) => {
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      role: values.role,
      permissions: values.permissions
    };

    setAdminUsers(prev => 
      prev.map(u => u.id === editingUser.id ? updatedUser : u)
    );

    // Update current user's permissions if editing self
    if (user && user.id === editingUser.id) {
      updateUserPermissions(editingUser.id, values.permissions);
    }

    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const getRoleColor = (role: Role) => {
    return role === 'super_admin' ? 'purple' : 'blue';
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: AdminUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-slate-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => (
        <Tag color={getRoleColor(role)}>
          {role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </Tag>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: Permission[]) => (
        <div>
          <Text className="text-sm text-slate-600">
            {permissions.length} of {ALL_PERMISSIONS.length} permissions
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AdminUser) => (
        <ProtectedRoute permission="permissions.edit">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPermissions(record)}
            disabled={!isRole('super_admin') && record.role === 'super_admin'}
          >
            Edit Permissions
          </Button>
        </ProtectedRoute>
      ),
    },
  ];

  return (
    <ProtectedRoute permission="permissions.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">Permission Management</Title>
              <Text className="text-slate-600">Manage roles and permissions for admin users</Text>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={adminUsers}
            rowKey="id"
            pagination={false}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Edit User Permissions"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingUser(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select onChange={handleRoleChange} disabled={!isRole('super_admin')}>
                <Option value="admin">Admin</Option>
                <Option value="super_admin">Super Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="permissions"
              label="Permissions"
              rules={[{ required: true, message: 'Please select permissions!' }]}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 gap-2">
                  {ALL_PERMISSIONS.map(permission => (
                    <Checkbox key={permission} value={permission}>
                      {PERMISSION_LABELS[permission]}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Save Changes
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default PermissionManager;
