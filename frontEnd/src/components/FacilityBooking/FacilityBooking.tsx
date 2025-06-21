
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import ProtectedRoute from '../ProtectedRoute';
import FacilityBookingService from '../../services/facilityBooking.service';

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
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let societyId=null
      if (user.role=="admin") {
        societyId=user.society._id;
      }
      const response = await FacilityBookingService.getBookings(societyId);
      setBookings(response?.result);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (bookingId: string) => {
    try {
      await FacilityBookingService.updateBookingStatus(bookingId, { status: 'approved' });
      message.success('Booking approved successfully');
      fetchBookings();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await FacilityBookingService.updateBookingStatus(bookingId, { status: 'rejected' });
      message.success('Booking rejected successfully');
      fetchBookings();
    } catch (error: any) {
      console.error(error.response?.data?.message || 'Failed to reject booking');
    }
  };


  const filteredBookings = bookings?.filter(booking => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return booking.societyId === user?.society?._id;
  });



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
                {user?.society?.name && ` - ${user.society?.name}`}
              </Title>
              <Text className="text-gray-600">
                Manage facility bookings and availability
              </Text>
            </div>
            {user?.role === 'admin' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
              >
                Book Facility
              </Button>
            )}
            </div>

          <Table
            columns={columns}
            dataSource={filteredBookings}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />

          {/* <CreateBookingModal
            isVisible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
            onSuccess={fetchBookings}
          /> */}
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default FacilityBooking;
