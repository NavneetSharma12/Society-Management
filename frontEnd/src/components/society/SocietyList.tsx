import React from 'react';
import { Table, Button, Avatar, Tag, Space } from 'antd';
import { HomeOutlined, EditOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { Society } from '../../types/society';

interface SocietyListProps {
  societies: Society[];
  onEdit: (society: Society) => void;
  onView: (society: Society) => void;
  onCreateAdmin: (society: Society) => void;
  hasPermission: (permission: string) => boolean;
  loading?: boolean;
}

const SocietyList: React.FC<SocietyListProps> = ({
  societies,
  onEdit,
  onView,
  onCreateAdmin,
  hasPermission,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const columns = [
    {
      title: 'Society',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Society) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<HomeOutlined />} className="bg-blue-600" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.city}, {record.state}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Admin',
      dataIndex: 'adminName',
      key: 'adminName',
      render: (adminName: string, record: Society) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserAddOutlined />} className="bg-green-600" />
          <div>
            <div className="font-medium">{adminName}</div>
            {/* <div className="text-sm text-gray-500">{record.adminEmail}</div> */}
          </div>
        </div>
      ),
    },
    {
      title: 'Units',
      key: 'units',
      render: (text: string, record: Society) => (
        <div>
          <div className="font-medium">{record.occupiedUnits}/{record.totalUnits}</div>
          <div className="text-sm text-gray-500">
            {Math.round((record.occupiedUnits / record.totalUnits) * 100)}% Occupied
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Society) => (
        <Space>
          {hasPermission('society.edit') && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          )}
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            View
          </Button>
          {hasPermission('society.assign_admin') && (
            <Button
              type="text"
              icon={<UserAddOutlined />}
              onClick={() => onCreateAdmin(record)}
            >
              {record.adminId ? 'Reassign Admin' : 'Assign Admin'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={societies}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} societies`,
      }}
    />
  );
};

export default SocietyList;