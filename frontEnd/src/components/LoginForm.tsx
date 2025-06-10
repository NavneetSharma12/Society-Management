
import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = async (values: { email: string; password: string }) => {
    const success = await dispatch(loginUser(values.email, values.password));
    if (success) {
      navigate('/');
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
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
            closable
            onClose={handleClearError}
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

        <div className="mt-4 text-center">
          <Text className="text-sm text-gray-500">
            Enter your credentials to access the admin panel
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
