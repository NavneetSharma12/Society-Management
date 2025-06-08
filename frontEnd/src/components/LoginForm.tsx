
import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { usePermissions } from '../contexts/PermissionContext';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = usePermissions();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const success = await login(values.email, values.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-white text-xl" />
          </div>
          <Title level={3}>Admin Panel Login</Title>
          <Text className="text-slate-600">Please sign in to continue</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            className="mb-4"
            showIcon
          />
        )}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="admin@admin.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="admin123"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-blue-600"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <Text className="text-sm text-blue-700">
            <strong>Demo Credentials:</strong><br />
            Super Admin: super@admin.com / admin123<br />
            Admin: admin@admin.com / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
