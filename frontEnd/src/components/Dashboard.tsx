import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Badge, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Residents',
      value: 284,
      change: 12,
      positive: true,
      icon: <TeamOutlined className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Pending Requests',
      value: 8,
      change: 3,
      positive: false,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Active Members',
      value: 267,
      change: 5,
      positive: true,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Monthly Growth',
      value: '12%',
      change: 2.5,
      positive: true,
      icon: <RiseOutlined className="text-purple-600" />,
      color: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'submitted a new member request',
      time: '2 minutes ago',
      type: 'request'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'updated profile information',
      time: '15 minutes ago',
      type: 'update'
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'approved member request for John Smith',
      time: '1 hour ago',
      type: 'approval'
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      action: 'logged maintenance request',
      time: '2 hours ago',
      type: 'maintenance'
    }
  ];

  const pendingRequests = [
    { name: 'James Wilson', email: 'james.wilson@email.com', date: '2024-06-07', unit: 'A-204' },
    { name: 'Lisa Brown', email: 'lisa.brown@email.com', date: '2024-06-06', unit: 'B-105' },
    { name: 'David Lee', email: 'david.lee@email.com', date: '2024-06-05', unit: 'C-301' }
  ];

  return (
    <div className="space-y-6">
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
          <Card title="Occupancy Rate" className="h-full">
            <div className="text-center">
              <Progress
                type="circle"
                percent={89}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                className="mb-4"
              />
              <div>
                <Title level={4}>267/300 Units</Title>
                <Text className="text-slate-600">89% Occupied</Text>
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

        {/* Pending Requests */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div className="flex items-center justify-between">
                <span>Pending Requests</span>
                <Badge count={pendingRequests.length} className="bg-orange-500" />
              </div>
            } 
            className="h-full"
          >
            <List
              dataSource={pendingRequests}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <Text className="text-xs text-slate-500">Unit {item.unit}</Text>
                      </div>
                    </div>
                    <Badge status="warning" text="Pending" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
