
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Space, Typography, Tag, Avatar, Input, Select, Row, Col, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, UserOutlined, SearchOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { Resident } from '../../types/user';
import ProtectedRoute from '../ProtectedRoute';
import ResidentForm from './ResidentForm';
import { residentService } from '@/services/resident.service';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ResidentList: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert API response to match Resident interface
  const convertApiResponse = (data: any[]): Resident[] => {
    return data.map(item => ({
      ...item,
      moveInDate: new Date(item.moveInDate),
    }));
  };

  const fetchResidents = async () => {
    setLoading(true);
    try {
      let data;
      if (user?.role === 'super_admin') {
        data = await residentService.getAllResidents();
      } else if (user?.society._id) {
        data = await residentService.getResidentsBySociety(user.society._id);
      } else {
        throw new Error('Society ID is required');
      }
      setResidents(convertApiResponse(data?.result));
      setError(null);
    } catch (err: any) {
      // setError(err.message || 'Failed to fetch residents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [user]);

  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let filtered = residents;
    
    // Filter by user's society if not super admin
    if (user?.role !== 'super_admin' && user?.society) {
      filtered = filtered.filter(resident => resident.societyId._id === user.society._id);
    }
    
    console.log(filtered);
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resident =>
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(resident => resident.status === statusFilter);
    }
    setFilteredResidents(filtered);
  }, [residents, user, searchTerm, statusFilter]);

  const handleViewDetails = (resident: Resident) => {
    console.log(resident,"reseu")
    let detail ={
      ...resident,
      societyName:resident.societyId.name,
      societyId:resident.societyId._id,
    }
    setSelectedResident(detail);

    setIsDetailModalVisible(true);
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormModalVisible(true);
  };

  const handleAdd = () => {
    setEditingResident(null);
    setIsFormModalVisible(true);
  };

  const handleSaveResident = async (residentData: Partial<Resident>): Promise<boolean> => {
    try {
      if (editingResident) {
        // Update existing resident
        await residentService.updateResident(editingResident._id!, residentData);
      } else {
        // Add new resident
        await residentService.createResident(residentData as Omit<Resident, '_id'>);
      }
      fetchResidents(); // Refresh the list
      setIsFormModalVisible(false);
      setEditingResident(null);
      return true;
    } catch (error) {
      console.error('Error saving resident:', error);
      message.error('Failed to save resident');
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Resident',
      content: 'Are you sure you want to delete this resident?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await residentService.deleteResident(id);
          fetchResidents(); // Refresh the list
          message.success('Resident deleted successfully');
        } catch (error) {
          console.error('Error deleting resident:', error);
          message.error('Failed to delete resident');
        }
      }
    });
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
      title: 'Unit Details',
      key: 'unitDetails',
      render: (_: any, record: Resident) => (
        <div>
          <div className="font-medium">{record.unitNumber}</div>
          <Tag color={record.isOwner ? 'blue' : 'orange'}>
            {record.isOwner ? 'Owner' : 'Tenant'}
          </Tag>
        </div>
      ),
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
      title: 'Joining Date',
      key: 'joinInDate',
      render: (_: any, record: Resident) => (
        new Date(record.moveInDate).toLocaleDateString()
      ),
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
              onClick={() => handleEdit(record)}
              size="small"
            >
              Edit
            </Button>
          )}
          {hasPermission('residents.delete') && (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id!)}
              size="small"
              danger
            >
              Delete
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
                {/* {user?.societyName && ` - ${user.societyName}`} */}
              </Title>
              <Text className="text-gray-600">
                Manage resident information and profiles
              </Text>
            </div>
            {hasPermission('residents.create') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="bg-blue-600"
                // size="large"
              >
                Add Resident
              </Button>
            )}
          </div>

          {/* Filters and Search */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search residents..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredResidents}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} residents`,
            }}
            className="shadow-sm"
            loading={loading}
            locale={{
              emptyText: error || 'No residents found'
            }}
          />
        </Card>

        {/* Resident Details Modal */}
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
                {/* <p><strong>Family Members:</strong> {selectedResident.familyMembers}</p>
                <p><strong>Move-in Date:</strong> {selectedResident.moveInDate}</p> */}
              </Card>
            </div>
          )}
        </Modal>

        {/* Add/Edit Resident Modal */}
        <Modal
          title={editingResident ? 'Edit Resident' : 'Add New Resident'}
          open={isFormModalVisible}
          onCancel={() => {
            setIsFormModalVisible(false);
            setEditingResident(null);
          }}
          footer={null}
          width={800}
          destroyOnClose
        >
          <ResidentForm
            resident={editingResident || undefined}
            onSave={handleSaveResident}
            onCancel={() => {
              setIsFormModalVisible(false);
              setEditingResident(null);
            }}
            isEditing={!!editingResident}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default ResidentList;
