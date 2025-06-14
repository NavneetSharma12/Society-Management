
import React, { useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/Dashboard';
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import ResidentList from '../components/Resident/ResidentList';
import PendingRequests from '../components/PendingRequests';
import PermissionManager from '../components/PermissionManager';
import UserManagement from '../components/UserManagement';
import ActivityFeed from '../components/ActivityFeed';
import ActivityFilter from '../components/ActivityFilter';
import BillingManagement from '../components/BillingManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import FacilityBooking from '../components/FacilityBooking';
import StaffManagement from '../components/StaffManagement';
import LoginForm from '../components/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAppSelector } from '../store/hooks';
import { Card, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import SocietyManagement from '@/components/society/SocietyManagement';

const { Title, Text } = Typography;

const AdminPanel: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname.split('/admin/')[1] || 'dashboard';
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return user?.role === 'super_admin' ? <SuperAdminDashboard /> : (
          <ProtectedRoute permission="dashboard.view">
            <Dashboard />
          </ProtectedRoute>
        );
        case 'society-management':
        return user?.role === 'super_admin' ? <SocietyManagement /> : (
          <ProtectedRoute permission="society.view">
            <SocietyManagement/>
          </ProtectedRoute>
        );
      case 'resident-list':
        return <ResidentList />;
      case 'pending-requests':
        return <PendingRequests />;
      case 'resident-details':
        return (
          <ProtectedRoute permission="residents.view">
            <Card>
              <Title level={3}>Resident Profile Details</Title>
              <Text>Detailed view of resident information, status controls, and admin notes section.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'approval-history':
        return (
          <ProtectedRoute permission="requests.view">
            <Card>
              <Title level={3}>Approval History</Title>
              <Text>List of previously approved/rejected requests with timestamp for reference.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'billing-management':
        return <BillingManagement />;
      case 'complaint-management':
        return <ComplaintManagement />;
      case 'facility-booking':
        return <FacilityBooking />;
      case 'staff-management':
        return <StaffManagement />;
      case 'role-control':
        return <PermissionManager />;
      case 'user-management':
        return <UserManagement />;
      case 'permissions-list':
        return (
          <ProtectedRoute permission="permissions.view">
            <Card>
              <Title level={3}>Permissions List</Title>
              <Text>Manage and toggle access permissions for various modules (Announcements, Events).</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'edit-permissions':
        return (
          <ProtectedRoute permission="permissions.edit">
            <Card>
              <Title level={3}>Edit Permissions</Title>
              <Text>Module-specific access toggles with save option to confirm changes.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'activity-feed':
        return <ActivityFeed />;
      case 'filter-activity':
        return <ActivityFilter />;
      case 'notification-list':
        return (
          <ProtectedRoute permission="notifications.view">
            <Card>
              <Title level={3}>Notification List</Title>
              <Text>Display of notification preferences, allowing admin to enable or disable notifications for each category.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'manage-notifications':
        return (
          <ProtectedRoute permission="notifications.create">
            <Card>
              <Title level={3}>Manage Notifications</Title>
              <Text>Options to create and send custom notifications to specific residents or groups.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'engagement-report':
        return (
          <ProtectedRoute permission="reports.view">
            <Card>
              <Title level={3}>Resident Engagement Report</Title>
              <Text>Charts (bar, pie) visualizing resident engagement across various app modules.</Text>
            </Card>
          </ProtectedRoute>
        );
      case 'download-report':
        return (
          <ProtectedRoute permission="reports.download">
            <Card>
              <Title level={3}>Download Reports</Title>
              <Text>Export button with options to download reports in PDF or CSV formats.</Text>
            </Card>
          </ProtectedRoute>
        );
      default:
        return user?.role === 'super_admin' ? <SuperAdminDashboard /> : (
          <ProtectedRoute permission="dashboard.view">
            <Dashboard />
          </ProtectedRoute>
        );
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPanel;
