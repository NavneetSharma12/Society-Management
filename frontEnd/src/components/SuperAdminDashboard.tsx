
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Typography, Tag } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  DollarCircleOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Society } from '../types/society';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;

const SuperAdminDashboard: React.FC = () => {
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
    },
    {
      id: '2',
      name: 'Sunset Heights',
      description: 'Luxury high-rise',
      address: '456 Sunset Boulevard',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      contactEmail: 'admin@sunsetheights.com',
      contactPhone: '+91 9876543211',
      totalUnits: 200,
      occupiedUnits: 180,
      adminId: '3',
      adminName: 'Jane Doe',
      adminEmail: 'jane@sunsetheights.com',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      status: 'active'
    }
  ]);

  const columns = [
    {
      title: 'Society',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Society) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{record.city}, {record.state}</div>
        </div>
      ),
    },
    {
      title: 'Admin',
      dataIndex: 'adminName',
      key: 'adminName',
      render: (adminName: string, record: Society) => (
        <div>
          <div className="font-medium">{adminName}</div>
          <div className="text-sm text-gray-500">{record.adminEmail}</div>
        </div>
      ),
    },
    {
      title: 'Units',
      key: 'units',
      render: (_, record: Society) => (
        <div>
          <Text>{record.occupiedUnits}/{record.totalUnits}</Text>
          <div className="text-sm text-gray-500">
            {Math.round((record.occupiedUnits / record.totalUnits) * 100)}% occupied
          </div>
        </div>
      ),
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
      render: (_, record: Society) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">View</Button>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const totalUnits = societies.reduce((sum, society) => sum + society.totalUnits, 0);
  const occupiedUnits = societies.reduce((sum, society) => sum + society.occupiedUnits, 0);

  return (
    <ProtectedRoute permission="society.view_all">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="!mb-1">Super Admin Dashboard</Title>
            <Text className="text-gray-600">Manage all societies and administrative functions</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600">
            Add Society
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Societies"
                value={societies.length}
                prefix={<HomeOutlined className="text-blue-600" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Units"
                value={totalUnits}
                prefix={<UserOutlined className="text-green-600" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Occupied Units"
                value={occupiedUnits}
                prefix={<UserOutlined className="text-orange-600" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Occupancy Rate"
                value={Math.round((occupiedUnits / totalUnits) * 100)}
                suffix="%"
                prefix={<DollarCircleOutlined className="text-purple-600" />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0">Society Management</Title>
            <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600">
              Add New Society
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={societies}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default SuperAdminDashboard;
