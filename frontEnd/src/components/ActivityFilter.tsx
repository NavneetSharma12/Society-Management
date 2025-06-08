
import React, { useState } from 'react';
import { Card, Typography, Space, Select, Statistic, Row, Col, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ActivityType } from '../types/activity';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

const ActivityFilter: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  // Mock analytics data - replace with your backend API
  const activityStats = {
    week: {
      total: 156,
      breakdown: [
        { type: 'Events', count: 45, color: '#1890ff' },
        { type: 'Chats', count: 38, color: '#52c41a' },
        { type: 'Maintenance', count: 28, color: '#fa8c16' },
        { type: 'Announcements', count: 25, color: '#722ed1' },
        { type: 'RSVPs', count: 20, color: '#13c2c2' }
      ],
      trend: [
        { day: 'Mon', activities: 18 },
        { day: 'Tue', activities: 22 },
        { day: 'Wed', activities: 25 },
        { day: 'Thu', activities: 28 },
        { day: 'Fri', activities: 32 },
        { day: 'Sat', activities: 19 },
        { day: 'Sun', activities: 12 }
      ]
    }
  };

  const currentStats = activityStats[selectedPeriod];

  return (
    <ProtectedRoute permission="activity.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">Activity Analytics</Title>
              <Text className="text-slate-600">Filter and analyze activity patterns by type</Text>
            </div>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="min-w-32"
            >
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
              <Option value="quarter">This Quarter</Option>
            </Select>
          </div>

          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center">
                <Statistic
                  title="Total Activities"
                  value={currentStats.total}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center">
                <Statistic
                  title="Most Active Day"
                  value="Thursday"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center">
                <Statistic
                  title="Average per Day"
                  value={22.3}
                  precision={1}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center">
                <Statistic
                  title="Active Residents"
                  value={89}
                  suffix="/ 120"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Card title="Activity Trend" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentStats.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activities" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card title="Activity Distribution" className="h-80">
                <ResponsiveContainer width="100%" height="60%">
                  <PieChart>
                    <Pie
                      data={currentStats.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="count"
                    >
                      {currentStats.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {currentStats.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <Text className="text-sm">{item.type}</Text>
                      </div>
                      <Text className="text-sm font-medium">{item.count}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="Activity Type Breakdown" className="mt-6">
            <Space direction="vertical" className="w-full" size="large">
              {currentStats.breakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <Text>{item.type}</Text>
                    <Text className="font-medium">{item.count} ({Math.round((item.count / currentStats.total) * 100)}%)</Text>
                  </div>
                  <Progress 
                    percent={Math.round((item.count / currentStats.total) * 100)} 
                    strokeColor={item.color}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ActivityFilter;
