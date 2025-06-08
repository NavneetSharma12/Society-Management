
import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Space, Select, DatePicker, Button, Input } from 'antd';
import { SearchOutlined, FilterOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Activity, ActivityType } from '../types/activity';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ActivityFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ActivityType | undefined>();
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  // Mock data - replace with your backend API
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      residentId: 'r1',
      residentName: 'John Smith',
      type: 'event',
      title: 'RSVP to Community BBQ',
      description: 'Confirmed attendance for Saturday BBQ event',
      timestamp: new Date('2024-06-07T14:30:00'),
      details: { eventId: 'e1' }
    },
    {
      id: '2',
      residentId: 'r2',
      residentName: 'Sarah Johnson',
      type: 'maintenance',
      title: 'Submitted Maintenance Request',
      description: 'Reported leaky faucet in kitchen',
      timestamp: new Date('2024-06-07T10:15:00'),
      details: { requestId: 'm1' }
    },
    {
      id: '3',
      residentId: 'r1',
      residentName: 'John Smith',
      type: 'chat',
      title: 'Posted in Community Chat',
      description: 'Shared update about parking policy changes',
      timestamp: new Date('2024-06-06T18:45:00')
    },
    {
      id: '4',
      residentId: 'r3',
      residentName: 'Mike Davis',
      type: 'announcement',
      title: 'Viewed Pool Closure Notice',
      description: 'Read announcement about pool maintenance',
      timestamp: new Date('2024-06-06T16:20:00'),
      details: { announcementId: 'a1' }
    },
    {
      id: '5',
      residentId: 'r2',
      residentName: 'Sarah Johnson',
      type: 'rsvp',
      title: 'RSVP to Book Club',
      description: 'Declined invitation to monthly book club meeting',
      timestamp: new Date('2024-06-05T09:30:00'),
      details: { eventId: 'e2' }
    }
  ]);

  const getActivityTypeColor = (type: ActivityType) => {
    const colors = {
      event: 'blue',
      chat: 'green',
      maintenance: 'orange',
      announcement: 'purple',
      rsvp: 'cyan'
    };
    return colors[type];
  };

  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      event: <CalendarOutlined />,
      chat: <UserOutlined />,
      maintenance: <FilterOutlined />,
      announcement: <SearchOutlined />,
      rsvp: <CalendarOutlined />
    };
    return icons[type];
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || activity.type === filterType;
    const matchesDate = !dateRange || (
      activity.timestamp >= dateRange[0].toDate() && 
      activity.timestamp <= dateRange[1].toDate()
    );
    
    return matchesSearch && matchesType && matchesDate;
  });

  const columns = [
    {
      title: 'Resident',
      dataIndex: 'residentName',
      key: 'resident',
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600 text-sm" />
          </div>
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: 'Activity',
      dataIndex: 'title',
      key: 'activity',
      render: (title: string, record: Activity) => (
        <div>
          <div className="font-medium">{title}</div>
          <Text className="text-sm text-slate-500">{record.description}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: ActivityType) => (
        <Tag icon={getActivityIcon(type)} color={getActivityTypeColor(type)}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: Date) => (
        <div>
          <div className="text-sm">{timestamp.toLocaleDateString()}</div>
          <div className="text-xs text-slate-500">{timestamp.toLocaleTimeString()}</div>
        </div>
      ),
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType(undefined);
    setDateRange(null);
  };

  return (
    <ProtectedRoute permission="activity.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">Activity Feed</Title>
              <Text className="text-slate-600">Monitor resident activities and engagement</Text>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <Input
              placeholder="Search by resident or activity..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            
            <Select
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              allowClear
              className="min-w-32"
            >
              <Option value="event">Events</Option>
              <Option value="chat">Chats</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="announcement">Announcements</Option>
              <Option value="rsvp">RSVPs</Option>
            </Select>

            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />

            <Button onClick={clearFilters} type="default">
              Clear Filters
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredActivities}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} activities`
            }}
            className="shadow-sm"
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ActivityFeed;
