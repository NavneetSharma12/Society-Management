import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { FacilityBookingViewModel } from '../../types/facilityBooking';

interface ViewBookingModalProps {
  booking: FacilityBookingViewModel | null;
  visible: boolean;
  onClose: () => void;
}

const ViewBookingModal: React.FC<ViewBookingModalProps> = ({ booking, visible, onClose }) => {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  return (
    <Modal
      title="Booking Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Facility Name">{booking.facilityName}</Descriptions.Item>
        <Descriptions.Item label="Resident Name">{booking.residentName}</Descriptions.Item>
        <Descriptions.Item label="Unit Number">{booking.unitNumber}</Descriptions.Item>
        <Descriptions.Item label="Booking Date">{booking.bookingDate}</Descriptions.Item>
        <Descriptions.Item label="Time Slot">{booking.timeSlot}</Descriptions.Item>
        <Descriptions.Item label="Purpose">{booking.purpose}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(booking.status)}>
            {booking.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(booking.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewBookingModal;