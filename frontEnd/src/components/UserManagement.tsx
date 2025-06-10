import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { User, CreateUserRequest } from '../types/user';
import { Society } from '../types/society';
import { Permission, Role } from '../types/permissions';
import { ALL_PERMISSIONS, PERMISSION_LABELS, DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const isRole = (role: Role): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'super@admin.com',
      role: 'super_admin',
      permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@greenvalley.com',
      role: 'admin',
      permissions: DEFAULT_ROLE_PERMISSIONS.admin,
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      status: 'active',
      phone: '+91 9876543210'
    }
  ]);

  const [societies] = useState<Society[]>([
    {
      id: '1',
      name: 'Green Valley Apartments',
      description: 'Modern residential complex',
      address: '123 Green Valley Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      contactEmail: 'admin@greenvalley.com',
      contactPhone: '+91 9876543210',
      totalUnits: 120,
      occupiedUnits: 95,
      adminId: '2',
      adminName: 'John Smith',
      adminEmail: 'john@greenvalley.com',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      status: 'active'
    }
  ]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateUser = (values: CreateUserRequest) => {
    const selectedSociety = societies.find(s => s.id === values.societyId);
    const newUser: User = {
      id: Date.now().toString(),
      ...values,
      societyName: selectedSociety?.name,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleRoleChange = (role: Role) => {
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role];
    form.setFieldsValue({ permissions: defaultPermissions });
  };

  const getRoleColor = (role: Role) => {
    return role === 'super_admin' ? 'purple' : 'blue';
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} className="bg-blue-600" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
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
      title: 'Society',
      dataIndex: 'societyName',
      key: 'societyName',
      render: (societyName: string) => societyName || 'All Societies',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            disabled={!isRole('super_admin') && record.role === 'super_admin'}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute permission="permissions.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">User Management</Title>
              <Text className="text-gray-600">Manage admin users and their permissions</Text>
            </div>
            {isRole('super_admin') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
                className="bg-blue-600"
              >
                Create Admin User
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Create Admin User"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateUser}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name!' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email!' },
                  { type: 'email', message: 'Please enter valid email!' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="phone"
                label="Phone"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter password!' }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select onChange={handleRoleChange}>
                  <Option value="admin">Admin</Option>
                  {isRole('super_admin') && <Option value="super_admin">Super Admin</Option>}
                </Select>
              </Form.Item>

              <Form.Item
                name="societyId"
                label="Society"
                rules={[{ required: true, message: 'Please select a society!' }]}
              >
                <Select placeholder="Select society">
                  {societies.map(society => (
                    <Option key={society.id} value={society.id}>
                      {society.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="permissions"
              label="Permissions"
              rules={[{ required: true, message: 'Please select permissions!' }]}
            >
              <Select mode="multiple" placeholder="Select permissions">
                {ALL_PERMISSIONS.map(permission => (
                  <Option key={permission} value={permission}>
                    {PERMISSION_LABELS[permission]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Create User
                </Button>
                <Button onClick={() => setIsCreateModalVisible(false)}>
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

export default UserManagement;
