import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { Society, CreateSocietyRequest } from '../../types/society';

const { TextArea } = Input;
const { Option } = Select;

interface CreateAndEditSocietyProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateSocietyRequest) => void;
  initialValues?: Society;
  mode: 'create' | 'edit';
}

const CreateAndEditSociety: React.FC<CreateAndEditSocietyProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  initialValues,
  mode
}) => {
  const [form] = Form.useForm();
  const [loading,setLoading]=useState(false);
  React.useEffect(() => {
    if (initialValues && mode === 'edit') {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form, mode]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Please check your input');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create New Society' : 'Edit Society'}
      open={isVisible}
      loading={loading}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Society Name"
          rules={[{ required: true, message: 'Please enter society name' }]}
        >
          <Input placeholder="Enter society name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={4} placeholder="Enter society description" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input placeholder="Enter society address" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter city' }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'Please enter state' }]}
          >
            <Input placeholder="Enter state" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="zipCode"
            label="ZIP Code"
            rules={[{ required: true, message: 'Please enter ZIP code' }]}
          >
            <Input placeholder="Enter ZIP code" />
          </Form.Item>

          <Form.Item
            name="totalUnits"
            label="Total Units"
            rules={[{ required: true, message: 'Please enter total units' }]}
          >
            <Input type="number" placeholder="Enter total units" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="contactEmail"
            label="Contact Email"
            rules={[{ required: true, message: 'Please enter contact email', type: 'email' }]}
          >
            <Input placeholder="Enter contact email" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="Contact Phone"
            rules={[{ required: true, message: 'Please enter contact phone' }]}
          >
            <Input placeholder="Enter contact phone" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateAndEditSociety;