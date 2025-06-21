import React, { useState, useEffect } from 'react';
import complaintService from '@/services/complaint.service';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { useAppSelector } from '../store/hooks';
// import ProtectedRoute from './ProtectedRoute';
// import ComplaintUpdateModal from './ComplaintUpdateModal';
import { useAppSelector } from '@/store/hooks';
import ProtectedRoute from '../ProtectedRoute';
import ComplaintUpdateModal from './ComplaintUpdateModal';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  residentName: string;
  unitNumber: string;
  societyId: string;
  societyName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

const ComplaintManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let societyId=null;
      if(user.role== "admin"){
        societyId = user?.society?._id;
      }
      const response = await complaintService.getAllComplaints(societyId);
      if (response.success) {
        console.log("response.result",response.result)

        const formattedComplaints = response.result.map(complaint => ({
          id: complaint._id,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          priority: complaint.priority,
          status: complaint.status,
          residentName: complaint.residentId?.name,
          unitNumber: complaint.residentId?.email,
          societyId: complaint.societyId?._id,
          societyName: complaint.societyId?.name,
          assignedTo: complaint.assignedTo?.name,
          createdAt: new Date(complaint.createdAt).toISOString().split('T')[0],
          updatedAt: new Date(complaint.updatedAt).toISOString().split('T')[0],
          adminNotes: ''
        }));
        setComplaints(formattedComplaints);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const [dummyComplaints, setDummyComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Water leakage in bathroom',
      description: 'There is a water leakage in the main bathroom pipe',
      category: 'Plumbing',
      priority: 'high',
      status: 'open',
      residentName: 'Alice Johnson',
      unitNumber: 'A-101',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Lift not working',
      description: 'Main lift is out of order since yesterday',
      category: 'Maintenance',
      priority: 'urgent',
      status: 'in_progress',
      residentName: 'Bob Smith',
      unitNumber: 'B-205',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      assignedTo: 'Maintenance Team',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15',
      adminNotes: 'Technician scheduled for tomorrow morning'
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const filteredComplaints = complaints.filter(complaint => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return complaint.societyId === user?.society._id;
  });

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalVisible(true);
  };

  const handleUpdateComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsUpdateModalVisible(true);
  };

  const handleComplaintUpdate = (updatedComplaint: Complaint) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'blue';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'urgent': return 'purple';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'orange';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Complaint',
      key: 'complaint',
      render: (_, record: Complaint) => (
        <div>
          <div className="font-medium">{record.title}</div>
          <div className="text-sm text-gray-500">{record.category}</div>
        </div>
      ),
    },
    {
      title: 'Resident',
      key: 'resident',
      render: (_, record: Complaint) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<ExclamationCircleOutlined />} size="small" />
          <div>
            <div className="font-medium">{record.residentName}</div>
            <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => assignedTo || 'Unassigned',
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
      render: (_, record: Complaint) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          <ProtectedRoute permission="requests.approve">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleUpdateComplaint(record)}
            >
              Update
            </Button>
          </ProtectedRoute>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <ProtectedRoute permission="requests.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Complaint Management
                {user?.society?.name && ` - ${user?.society?.name}`}
              </Title>
              <Text className="text-gray-600">
                Track and resolve resident complaints
              </Text>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredComplaints}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Complaint Details"
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Title level={4} className="!mb-0">{selectedComplaint.title}</Title>
                <Space>
                  <Tag color={getPriorityColor(selectedComplaint.priority)}>
                    {selectedComplaint.priority.toUpperCase()}
                  </Tag>
                  <Tag color={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                  </Tag>
                </Space>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card size="small" title="Resident Information">
                  <p><strong>Name:</strong> {selectedComplaint.residentName}</p>
                  <p><strong>Unit:</strong> {selectedComplaint.unitNumber}</p>
                  <p><strong>Society:</strong> {selectedComplaint.societyName}</p>
                </Card>

                <Card size="small" title="Complaint Details">
                  <p><strong>Category:</strong> {selectedComplaint.category}</p>
                  <p><strong>Created:</strong> {selectedComplaint.createdAt}</p>
                  <p><strong>Assigned To:</strong> {selectedComplaint.assignedTo || 'Unassigned'}</p>
                </Card>
              </div>

              <Card size="small" title="Description">
                <p>{selectedComplaint.description}</p>
              </Card>

              {selectedComplaint.adminNotes && (
                <Card size="small" title="Admin Notes">
                  <p>{selectedComplaint.adminNotes}</p>
                </Card>
              )}
            </div>
          )}
        </Modal>

        <ComplaintUpdateModal
          visible={isUpdateModalVisible}
          complaint={selectedComplaint}
          onCancel={() => setIsUpdateModalVisible(false)}
          onUpdate={handleComplaintUpdate}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ComplaintManagement;
