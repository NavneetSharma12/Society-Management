import React from 'react';
import { Card, List, Avatar, Button, Tag, Space, Modal, Typography, Divider } from 'antd';
import {
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { confirm } = Modal;

interface PendingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestedUnit: string;
  submissionDate: string;
  documents: string[];
  status: 'pending' | 'under_review';
  message?: string;
}

const PendingRequests: React.FC = () => {
  const pendingRequests: PendingRequest[] = [
    {
      id: '1',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 123-4567',
      requestedUnit: 'A-204',
      submissionDate: '2024-06-07',
      documents: ['ID Copy', 'Income Proof', 'References'],
      status: 'pending',
      message: 'Looking forward to joining the community. I have all required documents ready.'
    },
    {
      id: '2',
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+1 (555) 234-5678',
      requestedUnit: 'B-105',
      submissionDate: '2024-06-06',
      documents: ['ID Copy', 'Income Proof'],
      status: 'under_review',
      message: 'Excited to be part of this community. Please let me know if you need any additional information.'
    },
    {
      id: '3',
      name: 'David Lee',
      email: 'david.lee@email.com',
      phone: '+1 (555) 345-6789',
      requestedUnit: 'C-301',
      submissionDate: '2024-06-05',
      documents: ['ID Copy', 'Income Proof', 'References', 'Background Check'],
      status: 'pending'
    }
  ];

  const showApprovalConfirm = (request: PendingRequest) => {
    confirm({
      title: 'Approve Member Request',
      content: `Are you sure you want to approve ${request.name} for unit ${request.requestedUnit}?`,
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        console.log('Approved:', request.name);
        // Handle approval logic here
      },
    });
  };

  const showRejectionConfirm = (request: PendingRequest) => {
    confirm({
      title: 'Reject Member Request',
      content: `Are you sure you want to reject ${request.name}'s application?`,
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('Rejected:', request.name);
        // Handle rejection logic here
      },
    });
  };

  const showRequestDetails = (request: PendingRequest) => {
    Modal.info({
      title: 'Member Request Details',
      width: 600,
      content: (
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={4} className="!mb-1">{request.name}</Title>
              <Text className="text-slate-600">Requesting Unit {request.requestedUnit}</Text>
            </div>
          </div>
          
          <Divider />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MailOutlined className="text-slate-500" />
                <Text>{request.email}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneOutlined className="text-slate-500" />
                <Text>{request.phone}</Text>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <HomeOutlined className="text-slate-500" />
                <Text>Unit {request.requestedUnit}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-slate-500" />
                <Text>{request.submissionDate}</Text>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Text strong>Submitted Documents:</Text>
            <div className="mt-2 space-x-2">
              {request.documents.map((doc, index) => (
                <Tag key={index} color="blue">{doc}</Tag>
              ))}
            </div>
          </div>
          
          {request.message && (
            <>
              <Divider />
              <div>
                <Text strong>Message:</Text>
                <div className="mt-2 p-3 bg-slate-50 rounded">
                  <Text>{request.message}</Text>
                </div>
              </div>
            </>
          )}
        </div>
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={3} className="!mb-1">New Member Requests</Title>
            <Text className="text-slate-600">Review and approve pending member applications</Text>
          </div>
          <Tag color="orange">{pendingRequests.length} Pending</Tag>
        </div>

        <List
          dataSource={pendingRequests}
          renderItem={(request) => (
            <List.Item
              className="border border-slate-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
              actions={[
                <Button
                  key="view"
                  icon={<EyeOutlined />}
                  onClick={() => showRequestDetails(request)}
                >
                  View Details
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckOutlined />}
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => showApprovalConfirm(request)}
                >
                  Approve
                </Button>,
                <Button
                  key="reject"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => showRejectionConfirm(request)}
                >
                  Reject
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar size="large" icon={<UserOutlined />} />}
                title={
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium">{request.name}</span>
                    <Tag color={request.status === 'pending' ? 'orange' : 'blue'}>
                      {request.status === 'pending' ? 'Pending' : 'Under Review'}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center space-x-1">
                        <MailOutlined />
                        <span>{request.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HomeOutlined />
                        <span>Unit {request.requestedUnit}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <CalendarOutlined />
                        <span>{request.submissionDate}</span>
                      </span>
                    </div>
                    <div className="space-x-2">
                      {request.documents.map((doc, index) => (
                        <Tag key={index}>{doc}</Tag>
                      ))}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default PendingRequests;
