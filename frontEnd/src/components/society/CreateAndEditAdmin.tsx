import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Society } from '../../types/society';
import { CreateUserRequest } from '../../types/user';

interface CreateAndEditAdminProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUserRequest) => void;
  society: Society | null;
  mode: 'create' | 'edit';
  initialValues?: {
    adminName?: string;
    adminEmail?: string;
  };
}

const CreateAndEditAdmin: React.FC<CreateAndEditAdminProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  society,
  mode,
  initialValues
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues && mode === 'edit') {
      form.setFieldsValue({
        name: initialValues.adminName,
        email: initialValues.adminEmail
      });
    }
  }, [initialValues, form, mode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Please check your input');
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create Society Admin' : 'Edit Admin Details'}
      open={isVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={520}
    >
      {society && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Society</div>
          <div className="font-medium">{society.name}</div>
          <div className="text-sm text-gray-500">{society.city}, {society.state}</div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Admin Name"
          rules={[{ required: true, message: 'Please enter admin name' }]}
        >
          <Input placeholder="Enter admin name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Admin Email"
          rules={[{ required: true, message: 'Please enter admin email', type: 'email' }]}
        >
          <Input placeholder="Enter admin email" />
        </Form.Item>

        {mode === 'create' && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateAndEditAdmin;