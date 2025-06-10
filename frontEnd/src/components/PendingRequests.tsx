
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Space, Typography, Tag, Avatar, Badge } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { MemberRequest } from '../types/user';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;

const PendingRequests: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [requests, setRequests] = useState<MemberRequest[]>([
    {
      id: '1',
      residentName: 'John Doe',
      email: 'john@email.com',
      phone: '+91 9876543212',
      unitNumber: 'C-301',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      requestDate: '2024-03-01',
      status: 'pending',
      documents: ['id_proof.pdf', 'address_proof.pdf'],
      notes: 'New resident moving in'
    },
    {
      id: '2',
      residentName: 'Jane Smith',
      email: 'jane@email.com',
      phone: '+91 9876543213',
      unitNumber: 'D-102',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      requestDate: '2024-03-02',
      status: 'pending',
      documents: ['lease_agreement.pdf'],
      notes: 'Tenant application'
    }
  ]);

  const [filteredRequests, setFilteredRequests] = useState<MemberRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    let filtered = requests;
    
    // Filter by user's society if not super admin
    if (user?.role !== 'super_admin' && user?.societyId) {
      filtered = filtered.filter(request => request.societyId === user.societyId);
    }
    
    setFilteredRequests(filtered);
  }, [requests, user]);

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const handleViewDetails = (request: MemberRequest) => {
    setSelectedRequest(request);
    setIsDetailModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const pendingCount = filteredRequests.filter(req => req.status === 'pending').length;

  const columns = [
    {
      title: 'Applicant',
      dataIndex: 'residentName',
      key: 'residentName',
      render: (name: string, record: MemberRequest) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserAddOutlined />} className="bg-blue-600" />
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
      render: (_, record: MemberRequest) => (
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
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: 'Documents',
      dataIndex: 'documents',
      key: 'documents',
      render: (documents: string[]) => (
        <Badge count={documents.length} showZero color="blue">
          <span className="text-sm">Files</span>
        </Badge>
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
      title: 'Actions',
      key: 'actions',
      render: (_, record: MemberRequest) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          {record.status === 'pending' && hasPermission('requests.approve') && (
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
              size="small"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Approve
            </Button>
          )}
          {record.status === 'pending' && hasPermission('requests.reject') && (
            <Button
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
              size="small"
              danger
            >
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute permission="requests.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1 flex items-center gap-2">
                New Member Requests
                {pendingCount > 0 && (
                  <Badge count={pendingCount} className="ml-2" />
                )}
              </Title>
              <Text className="text-gray-600">
                Review and manage new resident applications
              </Text>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Request Details"
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar size={64} icon={<UserAddOutlined />} className="bg-blue-600" />
                <div>
                  <Title level={4} className="!mb-1">{selectedRequest.residentName}</Title>
                  <Tag color={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.toUpperCase()}
                  </Tag>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card size="small" title="Contact Information">
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                </Card>

                <Card size="small" title="Residence Details">
                  <p><strong>Unit:</strong> {selectedRequest.unitNumber}</p>
                  <p><strong>Society:</strong> {selectedRequest.societyName}</p>
                </Card>
              </div>

              <Card size="small" title="Application Details">
                <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
                <p><strong>Documents:</strong> {selectedRequest.documents.join(', ')}</p>
                {selectedRequest.notes && (
                  <p><strong>Notes:</strong> {selectedRequest.notes}</p>
                )}
              </Card>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end space-x-2">
                  {hasPermission('requests.approve') && (
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setIsDetailModalVisible(false);
                      }}
                      className="bg-green-600"
                    >
                      Approve Request
                    </Button>
                  )}
                  {hasPermission('requests.reject') && (
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        setIsDetailModalVisible(false);
                      }}
                    >
                      Reject Request
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default PendingRequests;
