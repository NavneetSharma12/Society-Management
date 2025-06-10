
import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;

interface Booking {
  id: string;
  facilityName: string;
  residentName: string;
  unitNumber: string;
  bookingDate: string;
  timeSlot: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  societyId: string;
  societyName: string;
  createdAt: string;
}

const FacilityBooking: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      facilityName: 'Community Hall',
      residentName: 'Alice Johnson',
      unitNumber: 'A-101',
      bookingDate: '2024-02-20',
      timeSlot: '18:00 - 22:00',
      purpose: 'Birthday Party',
      status: 'pending',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      facilityName: 'Gym',
      residentName: 'Bob Smith',
      unitNumber: 'B-205',
      bookingDate: '2024-02-18',
      timeSlot: '06:00 - 08:00',
      purpose: 'Personal Training',
      status: 'approved',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-14'
    }
  ]);

  const filteredBookings = bookings.filter(booking => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return booking.societyId === user?.societyId;
  });

  const handleApprove = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'approved' as const }
          : booking
      )
    );
  };

  const handleReject = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'rejected' as const }
          : booking
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Facility',
      dataIndex: 'facilityName',
      key: 'facilityName',
    },
    {
      title: 'Resident',
      key: 'resident',
      render: (_, record: Booking) => (
        <div>
          <div className="font-medium">{record.residentName}</div>
          <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record: Booking) => (
        <div>
          <div className="font-medium">{record.bookingDate}</div>
          <div className="text-sm text-gray-500">{record.timeSlot}</div>
        </div>
      ),
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
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
      render: (_, record: Booking) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">View</Button>
          {record.status === 'pending' && (
            <>
              <Button 
                icon={<CheckOutlined />} 
                size="small" 
                type="primary"
                className="bg-green-600"
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button 
                icon={<CloseOutlined />} 
                size="small" 
                danger
                onClick={() => handleReject(record.id)}
              >
                Reject
              </Button>
            </>
          )}
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
                Facility Booking Management
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage facility bookings and availability
              </Text>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredBookings}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default FacilityBooking;
