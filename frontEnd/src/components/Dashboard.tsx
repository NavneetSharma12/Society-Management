
import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Badge, Typography, Alert } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const stats = [
    {
      title: 'Total Residents',
      value: 95,
      change: 8,
      positive: true,
      icon: <TeamOutlined className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Pending Requests',
      value: 12,
      change: 3,
      positive: false,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Active Members',
      value: 89,
      change: 5,
      positive: true,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Outstanding Dues',
      value: '₹85,240',
      change: 12.5,
      positive: false,
      icon: <DollarCircleOutlined className="text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'submitted maintenance request for Unit A-204',
      time: '15 minutes ago',
      type: 'request'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'paid monthly maintenance fee',
      time: '1 hour ago',
      type: 'payment'
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'booked community hall for birthday party',
      time: '2 hours ago',
      type: 'booking'
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      action: 'submitted complaint about parking issue',
      time: '3 hours ago',
      type: 'complaint'
    }
  ];

  const pendingRequests = [
    { name: 'James Wilson', email: 'james.wilson@email.com', date: '2024-06-07', unit: 'A-204', type: 'Maintenance' },
    { name: 'Lisa Brown', email: 'lisa.brown@email.com', date: '2024-06-06', unit: 'B-105', type: 'Complaint' },
    { name: 'David Lee', email: 'david.lee@email.com', date: '2024-06-05', unit: 'C-301', type: 'Booking' }
  ];

  const urgentMatters = [
    { title: 'Water Tank Cleaning', priority: 'High', dueDate: 'Today' },
    { title: 'Elevator Maintenance', priority: 'Medium', dueDate: 'Tomorrow' },
    { title: 'Security Meeting', priority: 'High', dueDate: '2 days' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Alert
        message={`Welcome back, ${user?.name}!`}
        description={`Managing ${user?.societyName || 'your society'} - You have 12 pending items requiring attention.`}
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-slate-600 text-sm">{stat.title}</Text>
                  <div className="flex items-center space-x-2 mt-1">
                    <Title level={3} className="!mb-0">
                      {stat.value}
                    </Title>
                    <div className={`flex items-center text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      <span className="ml-1">{stat.change}%</span>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Occupancy Rate */}
        <Col xs={24} lg={8}>
          <Card title="Unit Occupancy" className="h-full">
            <div className="text-center">
              <Progress
                type="circle"
                percent={79}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                className="mb-4"
              />
              <div>
                <Title level={4}>95/120 Units</Title>
                <Text className="text-slate-600">79% Occupied</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={8}>
          <Card title="Recent Activity" className="h-full">
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-start space-x-3 w-full">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{item.user}</span>
                        <span className="text-slate-600"> {item.action}</span>
                      </div>
                      <Text className="text-xs text-slate-500">{item.time}</Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Urgent Matters */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div className="flex items-center justify-between">
                <span>Urgent Matters</span>
                <Badge count={urgentMatters.length} className="bg-red-500" />
              </div>
            } 
            className="h-full"
          >
            <List
              dataSource={urgentMatters}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <ExclamationCircleOutlined className={`${item.priority === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <Text className="text-xs text-slate-500">Due: {item.dueDate}</Text>
                      </div>
                    </div>
                    <Badge 
                      status={item.priority === 'High' ? 'error' : 'warning'} 
                      text={item.priority} 
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Actions */}
      <Card title="Pending Actions">
        <List
          dataSource={pendingRequests}
          renderItem={(item) => (
            <List.Item className="border-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <Text className="text-sm text-slate-500">Unit {item.unit} - {item.type}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Text className="text-sm text-slate-500">{item.date}</Text>
                  <Badge status="warning" text="Pending" />
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
