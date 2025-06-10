
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  societyId: string;
  societyName: string;
  createdAt: string;
}

const StaffManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Security Guard',
      phone: '+91 9876543210',
      email: 'security@society.com',
      role: 'Security',
      department: 'Security',
      status: 'active',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Maintenance Staff',
      phone: '+91 9876543211',
      email: 'maintenance@society.com',
      role: 'Maintenance',
      department: 'Maintenance',
      status: 'active',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-10'
    }
  ]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredStaff = staff.filter(member => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return member.societyId === user?.societyId;
  });

  const handleCreateStaff = (values: any) => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      ...values,
      status: 'active',
      societyId: user?.societyId || '1',
      societyName: user?.societyName || 'Default Society',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStaff(prev => [...prev, newStaff]);
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Staff Member',
      key: 'staff',
      render: (_, record: Staff) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record: Staff) => (
        <div>
          <div className="font-medium">{record.phone}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Society',
      dataIndex: 'societyName',
      key: 'societyName',
      hidden: user?.role !== 'super_admin',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Staff) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">View</Button>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <ProtectedRoute permission="staff.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Staff Management
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage staff members and their assignments
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              className="bg-blue-600"
            >
              Add Staff
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredStaff}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Add New Staff Member"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateStaff}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter staff name!' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number!' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role!' }]}
              >
                <Select placeholder="Select role">
                  <Option value="Security">Security Guard</Option>
                  <Option value="Maintenance">Maintenance Staff</Option>
                  <Option value="Housekeeping">Housekeeping</Option>
                  <Option value="Gardener">Gardener</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department!' }]}
              >
                <Select placeholder="Select department">
                  <Option value="Security">Security</Option>
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="Housekeeping">Housekeeping</Option>
                  <Option value="Gardening">Gardening</Option>
                  <Option value="Administration">Administration</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Add Staff Member
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

export default StaffManagement;
