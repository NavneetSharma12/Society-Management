
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import ProtectedRoute from '../ProtectedRoute';
import FacilityBookingService from '../../services/facilityBooking.service';
import ViewBookingModal from './ViewBookingModal';

const { Title, Text } = Typography;

import { FacilityBookingViewModel, BookingStatus } from '../../types/facilityBooking';

const FacilityBooking: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [bookings, setBookings] = useState<FacilityBookingViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<FacilityBookingViewModel | null>(null);

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
    return booking.societyId._id === user?.society?._id;
  });



  const getStatusColor = (status: BookingStatus) => {
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
      render: (_, record: FacilityBookingViewModel) => (
        <div>
          <div className="font-medium">{record.residentName}</div>
          <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record: FacilityBookingViewModel) => (
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
      render: (status: BookingStatus) => (
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
      render: (_, record: FacilityBookingViewModel) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setIsViewModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                icon={<CheckOutlined />} 
                size="small" 
                type="primary"
                className="bg-green-600"
                onClick={() => handleApprove(record._id)}
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
            </div>

          <ViewBookingModal
            booking={selectedBooking}
            visible={isViewModalVisible}
            onClose={() => {
              setIsViewModalVisible(false);
              setSelectedBooking(null);
            }}
          />
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
