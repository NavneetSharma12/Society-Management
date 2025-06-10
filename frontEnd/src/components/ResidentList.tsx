import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { Resident } from '../types/user';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

const ResidentList: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [residents, setResidents] = useState<Resident[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@email.com',
      phone: '+91 9876543210',
      unitNumber: 'A-101',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      joinDate: '2024-01-15',
      status: 'active',
      familyMembers: 3
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@email.com',
      phone: '+91 9876543211',
      unitNumber: 'B-205',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      joinDate: '2024-02-01',
      status: 'active',
      familyMembers: 2
    }
  ]);

  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    let filtered = residents;
    
    // Filter by user's society if not super admin
    if (user?.role !== 'super_admin' && user?.societyId) {
      filtered = filtered.filter(resident => resident.societyId === user.societyId);
    }
    
    setFilteredResidents(filtered);
  }, [residents, user]);

  const handleViewDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDetailModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Resident',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Resident) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} className="bg-green-600" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record: Resident) => (
        <div>
          <div className="text-sm">{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Society',
      dataIndex: 'societyName',
      key: 'societyName',
    },
    {
      title: 'Family',
      dataIndex: 'familyMembers',
      key: 'familyMembers',
      render: (members: number) => `${members} members`,
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
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Resident) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          {hasPermission('residents.edit') && (
            <Button
              icon={<EditOutlined />}
              size="small"
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute permission="residents.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Resident Profiles
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage resident information and profiles
              </Text>
            </div>
            {hasPermission('residents.create') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-blue-600"
              >
                Add Resident
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            dataSource={filteredResidents}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Resident Details"
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedResident && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar size={64} icon={<UserOutlined />} className="bg-green-600" />
                <div>
                  <Title level={4} className="!mb-1">{selectedResident.name}</Title>
                  <Tag color={getStatusColor(selectedResident.status)}>
                    {selectedResident.status.toUpperCase()}
                  </Tag>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card size="small" title="Contact Information">
                  <p><strong>Email:</strong> {selectedResident.email}</p>
                  <p><strong>Phone:</strong> {selectedResident.phone}</p>
                </Card>

                <Card size="small" title="Residence Details">
                  <p><strong>Unit:</strong> {selectedResident.unitNumber}</p>
                  <p><strong>Society:</strong> {selectedResident.societyName}</p>
                </Card>
              </div>

              <Card size="small" title="Family Information">
                <p><strong>Family Members:</strong> {selectedResident.familyMembers}</p>
                <p><strong>Join Date:</strong> {selectedResident.joinDate}</p>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default ResidentList;
