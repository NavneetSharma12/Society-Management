import React from 'react';
import { Modal, Descriptions, Tag, Button, Avatar } from 'antd';
import { Society } from '../../types/society';
import { UserOutlined, EditOutlined, HomeOutlined } from '@ant-design/icons';

interface SocietyDetailProps {
  isVisible: boolean;
  onCancel: () => void;
  society: Society | null;
  onEditAdmin: () => void;
  hasPermission: (permission: string) => boolean;
}

const SocietyDetail: React.FC<SocietyDetailProps> = ({
  isVisible,
  onCancel,
  society,
  onEditAdmin,
  hasPermission
}) => {
  if (!society) return null;

  return (
    <Modal
      title={<Button type="text" onClick={onCancel}  className="absolute right-4 top-4" />}
      open={isVisible}
      onCancel={onCancel}
      width={720}
      footer={null}
      className="society-detail-modal"
    >
      <div className="flex items-center mb-6">
        <Avatar size={64} icon={<HomeOutlined />} className="bg-blue-500" />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold">{society.name}</h2>
          <Tag color={society.status === 'active' ? 'success' : 'error'} className="mt-1">
            {society.status}
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="space-y-2">
            <p><strong>Email:</strong> {society.contactEmail}</p>
            <p><strong>Phone:</strong> {society.contactPhone}</p>
            <p><strong>Address:</strong> {society.address}</p>
            <p>{society.city}, {society.state} {society.zipCode}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Unit Information</h3>
          <div className="space-y-2">
            <p><strong>Total Units:</strong> {society.totalUnits}</p>
            <p><strong>Occupied:</strong> {society.occupiedUnits}</p>
            <p><strong>Occupancy Rate:</strong> {Math.round((society.occupiedUnits / society.totalUnits) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Admin Details</h3>
          {hasPermission('society.edit_admin') && (
            <Button
              type="link"
              onClick={onEditAdmin}
              className="text-blue-500"
            >
              Update Admin
            </Button>
          )}
        </div>
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="bg-green-500" />
          <div className="ml-3">
            <p className="font-medium">{society.adminName}</p>
            <p className="text-gray-500">{society.adminEmail}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        Created: {new Date(society.createdAt).toLocaleDateString()}
      </p>
    </Modal>
  );
};

export default SocietyDetail;