
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Button, Dropdown } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DashboardOutlined,
  UserAddOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  LogoutOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const success = await dispatch(logout());
    if (success) {
      navigate('/login');
    }
  };
  // const handleLogout = async () => {
  //   try {
  //     await dispatch(logout()).unwrap();
  //     // Redirect to login page after successful logout
  //     window.location.href = '/login';
  //   } catch (error) {
  //     // Error is already handled in the thunk
  //   }
  // };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const location = useLocation();
  const currentPage = location.pathname.split('/admin/')[1] || 'dashboard';

  const handleMenuSelect = ({ key }: { key: string }) => {
    navigate(`/admin/${key}`);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      hidden: !hasPermission('dashboard.view')
    },
    {
      key: 'society-management',
      icon: < TeamOutlined/>,
      label: 'Society Management',
      hidden: !hasPermission('society.view')
    },
    {
      key: 'resident-list',
      icon: <TeamOutlined />,
      label: 'Resident Management',
      hidden: !hasPermission('residents.view'),
      // children: [
      //   { key: 'resident-list', label: 'Resident List', hidden: !hasPermission('residents.view') },
      //   { key: 'resident-details', label: 'Profile Details', hidden: !hasPermission('residents.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'pending-requests',
      icon: <UserAddOutlined />,
      label: 'Member Requests',
      hidden: !hasPermission('requests.view'),
      // children: [
      //   { key: 'pending-requests', label: 'Pending Requests', hidden: !hasPermission('requests.view') },
      //   { key: 'approval-history', label: 'Approval History', hidden: !hasPermission('requests.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'billing-management',
      icon: <DollarCircleOutlined />,
      label: 'Billing & Accounting',
      hidden: !hasPermission('reports.view'),
      // children: [
      //   { key: 'billing-management', label: 'Billing Management', hidden: !hasPermission('reports.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'complaint-management',
      icon: <ExclamationCircleOutlined />,
      label: 'Complaint Management',
      hidden: !hasPermission('requests.view'),
      // children: [
      //   { key: 'complaint-management', label: 'View Complaints', hidden: !hasPermission('requests.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'facility-booking',
      icon: <CalendarOutlined />,
      label: 'Facility Booking',
      hidden: !hasPermission('requests.view'),
      // children: [
      //   { key: 'facility-booking', label: 'Manage Bookings', hidden: !hasPermission('requests.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'staff-management',
      icon: <ToolOutlined />,
      label: 'Staff & Vendors',
      hidden: !hasPermission('residents.view'),
      // children: [
      //   { key: 'staff-management', label: 'Staff Management', hidden: !hasPermission('residents.view') },
      // ].filter(item => !item.hidden),
    },
    {
      key: 'permissions',
      icon: <SecurityScanOutlined />,
      label: 'Permissions',
      hidden: !hasPermission('permissions.view'),
      children: [
        { key: 'role-control', label: 'Role-Based Access', hidden: !hasPermission('permissions.view') },
        // { key: 'user-management', label: 'User Management', hidden: !hasPermission('permissions.edit') },
        // { key: 'permissions-list', label: 'Permissions List', hidden: !hasPermission('permissions.view') },
        // { key: 'edit-permissions', label: 'Edit Permissions', hidden: !hasPermission('permissions.edit') },
      ].filter(item => !item.hidden),
    },
    {
      key: 'activity',
      icon: <FileTextOutlined />,
      label: 'Activity Log',
      hidden: !hasPermission('activity.view'),
      children: [
        { key: 'activity-feed', label: 'Activity Feed', hidden: !hasPermission('activity.view') },
        { key: 'filter-activity', label: 'Filter by Type', hidden: !hasPermission('activity.view') },
      ].filter(item => !item.hidden),
    },
    {
      key: 'notifications',
      icon: <NotificationOutlined />,
      label: 'Notifications',
      hidden: !hasPermission('notifications.view'),
      children: [
        { key: 'notification-list', label: 'Notification List', hidden: !hasPermission('notifications.view') },
        { key: 'manage-notifications', label: 'Manage Notifications', hidden: !hasPermission('notifications.create') },
      ].filter(item => !item.hidden),
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports & Analytics',
      hidden: !hasPermission('reports.view'),
      children: [
        { key: 'engagement-report', label: 'Engagement Report', hidden: !hasPermission('reports.view') },
        { key: 'download-report', label: 'Download Reports', hidden: !hasPermission('reports.download') },
      ].filter(item => !item.hidden),
    },
  ].filter(item => !item.hidden);

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        className="bg-slate-900"
        theme="dark"
      >
        <div className="flex items-center justify-center p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserOutlined className="text-white text-lg" />
            </div>
            {!collapsed && (
              <div>
                <Title level={4} className="!text-white !mb-0">
                  Admin Panel
                </Title>
                <p className="text-slate-400 text-sm">
                  {user?.name || 'Management System'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          theme="dark"
          selectedKeys={[currentPage]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuSelect}
          className="bg-slate-900 border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Title level={3} className="!mb-0 !text-slate-800">
              {menuItems.find(item => item.key === currentPage)?.label || 'Dashboard'}
            </Title>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <BellOutlined className="text-xl text-slate-600 hover:text-blue-600 cursor-pointer" />
            </Badge>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button type="text" className="flex items-center space-x-2">
                <Avatar size="large" icon={<UserOutlined />} className="bg-blue-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-slate-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
