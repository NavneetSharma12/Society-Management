import React from 'react';
import { Modal, Form, Input, message, Select, Button } from 'antd';
import { Society } from '../../types/society';
import { CreateUserRequest } from '../../types/user';
import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PERMISSION_LABELS } from '@/config/permissions';
import { Role } from '@/types/permissions';

interface CreateAndEditAdminProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUserRequest) => void;
  society: Society | null;
  mode: 'create' | 'edit';
  initialValues?: {
    _id?: string;
    name?: string;
    email?: string;
    permissions?: string[];
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
  const { Option } = Select;

  React.useEffect(() => {
    console.log("initial",initialValues)
    if (initialValues && mode === 'edit') {
      form.setFieldsValue({
        name: initialValues.name,
        email: initialValues.email,
        permissions: initialValues.permissions,
        role: 'admin'
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form, mode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const adminData: CreateUserRequest = {
        ...values,
        role: 'admin' as Role,
        societyId: society?._id || '',
        permissions: values.permissions || DEFAULT_ROLE_PERMISSIONS['admin'],
        ...(mode === 'edit' && initialValues?._id && { _id: initialValues._id })
      };
      onSubmit(adminData);
      if (mode === 'create') {
        form.resetFields();
      }
    } catch (error) {
      message.error('Please check your input');
    }
  };

  const handleRoleChange = (role: Role) => {
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role];
    form.setFieldsValue({ permissions: defaultPermissions });
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create Society Admin' : 'Edit Admin Details'}
      open={isVisible}
      onCancel={() => {
        onCancel();
        if (mode === 'create') {
          form.resetFields();
        }
      }}
      onOk={handleSubmit}
      width={520}
    >
      {society && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Assigning admin to:</div>
          <div className="font-medium">{society.name}</div>
          <div className="text-sm text-gray-500">{society.city}, {society.state}</div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name!' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email!' },
              { type: 'email', message: 'Please enter valid email!' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {mode === 'create' && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password!' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select onChange={handleRoleChange} disabled={mode === 'edit'}>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="permissions"
          label="Permissions"
          rules={[{ required: true, message: 'Please select permissions!' }]}
        >
          <Select mode="multiple" placeholder="Select permissions">
            {ALL_PERMISSIONS.map(permission => (
              <Option key={permission} value={permission}>
                {PERMISSION_LABELS[permission]}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAndEditAdmin;