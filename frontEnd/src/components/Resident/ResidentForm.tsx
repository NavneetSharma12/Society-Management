
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Typography, message, Row, Col } from 'antd';
import { UserOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Resident } from '@/types/user';
import { useAppSelector } from '@/store/hooks';

const { Title, Text } = Typography;
const { Option } = Select;

interface ResidentFormProps {
  resident?: Resident;
  onSave: (resident: Partial<Resident>) => Promise<boolean>;
  onCancel: () => void;
  isEditing?: boolean;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ 
  resident, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (resident && isEditing) {
      form.setFieldsValue({
        name: resident.name,
        email: resident.email,
        phone: resident.phone,
        unitNumber: resident.unitNumber,
        status: resident.status,
        isOwner: resident.isOwner,
        moveInDate: resident.moveInDate instanceof Date 
          ? resident.moveInDate.toISOString().split('T')[0]
          : new Date(resident.moveInDate).toISOString().split('T')[0]
      });
    }
  }, [resident, isEditing, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (!user?.society) {
        message.error('Society ID is required');
        return;
      }

      const residentData: Partial<Resident> = {
        ...values,
        societyId: user.society?._id,
        moveInDate: values.moveInDate ? new Date(values.moveInDate) : new Date(),
        isOwner: values.isOwner || false,
        status: values.status || 'pending'
      };
      
      const result = await onSave(residentData);
      
      if (result) {
        message.success(`Resident ${isEditing ? 'updated' : 'added'} successfully!`);
        if (!isEditing) {
          form.resetFields();
        }
      }
    } catch (error) {
      message.error('Failed to save resident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          {isEditing ? 'Edit Resident' : 'Add New Resident'}
        </Title>
        <Text className="text-gray-600">
          {isEditing ? 'Update resident information' : 'Enter resident details to add them to the system'}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter resident name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter full name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                placeholder="Enter email address"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^\+?[\d\s-()]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input 
                placeholder="Enter phone number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="unitNumber"
              label="Unit Number"
              rules={[
                { required: true, message: 'Please enter unit number' }
              ]}
            >
              <Input 
                placeholder="e.g., A-101, B-205"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                { required: true, message: 'Please select status' }
              ]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="isOwner"
              label="Ownership Status"
              initialValue={false}
            >
              <Select placeholder="Select ownership status" >
                <Option value={true}>Owner</Option>
                <Option value={false}>Tenant</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              name="moveInDate"
              label="Move-in Date"
              rules={[
                { required: true, message: 'Please select move-in date' }
              ]}
            >
              <Input type="date"  />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            icon={<CloseOutlined />} 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={loading}
            className="bg-blue-600"
          >
            {isEditing ? 'Update Resident' : 'Add Resident'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ResidentForm;
