import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

interface Bill {
  id: string;
  residentName: string;
  unitNumber: string;
  billType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  societyId: string;
  societyName: string;
  createdAt: string;
}

const BillingManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      residentName: 'Alice Johnson',
      unitNumber: 'A-101',
      billType: 'Maintenance',
      amount: 5000,
      dueDate: '2024-02-15',
      status: 'pending',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      residentName: 'Bob Smith',
      unitNumber: 'B-205',
      billType: 'Water',
      amount: 800,
      dueDate: '2024-02-10',
      status: 'paid',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-10'
    }
  ]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredBills = bills.filter(bill => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return bill.societyId === user?.societyId;
  });

  const handleCreateBill = (values: any) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      ...values,
      status: 'pending',
      societyId: user?.societyId || '1',
      societyName: user?.societyName || 'Default Society',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setBills(prev => [...prev, newBill]);
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Resident',
      key: 'resident',
      render: (_, record: Bill) => (
        <div>
          <div className="font-medium">{record.residentName}</div>
          <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
        </div>
      ),
    },
    {
      title: 'Bill Type',
      dataIndex: 'billType',
      key: 'billType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
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
      render: (_, record: Bill) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">View</Button>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <ProtectedRoute permission="reports.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Billing & Accounting
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage bills, payments and financial reports
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              className="bg-blue-600"
            >
              Generate Bill
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredBills}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Generate New Bill"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateBill}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="residentName"
                label="Resident Name"
                rules={[{ required: true, message: 'Please enter resident name!' }]}
              >
                <Input placeholder="Enter resident name" />
              </Form.Item>

              <Form.Item
                name="unitNumber"
                label="Unit Number"
                rules={[{ required: true, message: 'Please enter unit number!' }]}
              >
                <Input placeholder="Enter unit number" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="billType"
                label="Bill Type"
                rules={[{ required: true, message: 'Please select bill type!' }]}
              >
                <Select placeholder="Select bill type">
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="Water">Water</Option>
                  <Option value="Electricity">Electricity</Option>
                  <Option value="Parking">Parking</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Amount (₹)"
                rules={[{ required: true, message: 'Please enter amount!' }]}
              >
                <Input type="number" placeholder="Enter amount" />
              </Form.Item>
            </div>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date!' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Generate Bill
                </Button>
                <Button onClick={() => setIsCreateModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default BillingManagement;
