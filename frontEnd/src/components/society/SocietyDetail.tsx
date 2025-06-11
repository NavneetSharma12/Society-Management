import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import { Society } from '../../types/society';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

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
      title="Society Details"
      open={isVisible}
      onCancel={onCancel}
      width={720}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>
      ]}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Society Name" span={2}>
          {society.name}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {society.description}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {society.address}
        </Descriptions.Item>
        <Descriptions.Item label="City">{society.city}</Descriptions.Item>
        <Descriptions.Item label="State">{society.state}</Descriptions.Item>
        <Descriptions.Item label="ZIP Code">{society.zipCode}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={society.status === 'active' ? 'success' : 'error'}>
            {society.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Contact Email">{society.contactEmail}</Descriptions.Item>
        <Descriptions.Item label="Contact Phone">{society.contactPhone}</Descriptions.Item>
        <Descriptions.Item label="Total Units">{society.totalUnits}</Descriptions.Item>
        <Descriptions.Item label="Occupied Units">{society.occupiedUnits}</Descriptions.Item>
        <Descriptions.Item label="Occupancy Rate">
          {Math.round((society.occupiedUnits / society.totalUnits) * 100)}%
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(society.createdAt).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-6">
        <Descriptions title="Admin Information" bordered>
          <Descriptions.Item label="Admin Name" span={2}>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                {society.adminName}
              </span>
              {hasPermission('society.edit_admin') && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={onEditAdmin}
                >
                  Edit Admin
                </Button>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Admin Email" span={2}>
            {society.adminEmail}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default SocietyDetail;