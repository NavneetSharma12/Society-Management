import React from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface CreateSocietyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SocietyFormData) => void;
}

type SocietyFormData = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  totalUnits: number;
  adminId: string;
};

const CreateSocietyModal: React.FC<CreateSocietyModalProps> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm<SocietyFormData>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Please check your input');
    }
  };

  return (
    <Modal
      title="Create New Society"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="grid grid-cols-2 gap-4"
        initialValues={{ totalUnits: 1 }}
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
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

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

        <Form.Item
          name="zipCode"
          label="Zip Code"
          rules={[{ required: true, message: 'Please enter zip code' }]}
        >
          <Input placeholder="Enter zip code" />
        </Form.Item>

        <Form.Item
          name="contactEmail"
          label="Contact Email"
          rules={[
            { required: true, message: 'Please enter contact email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input type="email" placeholder="Enter contact email" />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label="Contact Phone"
          rules={[
            { required: true, message: 'Please enter contact phone' },
            { min: 10, message: 'Phone number must be at least 10 digits' }
          ]}
        >
          <Input placeholder="Enter contact phone" />
        </Form.Item>

        <Form.Item
          name="totalUnits"
          label="Total Units"
          rules={[{ required: true, message: 'Please enter total units' }]}
        >
          <InputNumber
            min={1}
            placeholder="Enter total units"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="adminId"
          label="Admin"
          rules={[{ required: true, message: 'Please select an admin' }]}
        >
          <Select
            placeholder="Select admin"
            options={[]} // TODO: Add admin options
          />
        </Form.Item>

        <div className="col-span-2 flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Create Society
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateSocietyModal;