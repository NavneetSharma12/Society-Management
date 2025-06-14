import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';
import { Society, CreateSocietyRequest } from '../../types/society';
import { CreateUserRequest } from '../../types/user';
import { societyService } from '../../services/society.service';
import ProtectedRoute from '../ProtectedRoute';
import CreateAndEditSociety from './CreateAndEditSociety';
import CreateAndEditAdmin from './CreateAndEditAdmin';
import SocietyList from './SocietyList';
import SocietyDetail from './SocietyDetail';

const { Title } = Typography;

const SocietyManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const data = await societyService.getAll();
      console.log("data",data)
      setSocieties(data);
    } catch (error) {
      message.error('Failed to fetch societies');
    } finally {
      setLoading(false);
    }
  };
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateAdminModalVisible, setIsCreateAdminModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);

  const filteredSocieties = hasPermission('society.view_all') 
    ? societies 
    : societies.filter(society => society.adminId?.some(admin => admin._id === user?.id));
  console.log(user,"society",societies)
  const handleCreateSociety = async (values: CreateSocietyRequest) => {
    try {
      setLoading(true);
      const newSociety = await societyService.create(values);
      console.log(newSociety);
      // setSocieties(prev => [...prev, newSociety]);
      setIsCreateModalVisible(false);
      message.success('Society created successfully');
    } catch (error) {
      message.error('Failed to create society');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSociety = async (values: CreateSocietyRequest) => {
    if (!selectedSociety) return;
    
    try {
      setLoading(true);
      const updatedSociety = await societyService.update(selectedSociety._id, values);
      setSocieties(prev => prev.map(society => 
        society._id === selectedSociety._id ? updatedSociety : society
      ));
      setIsEditModalVisible(false);
      setSelectedSociety(null);
      message.success('Society updated successfully');
    } catch (error) {
      message.error('Failed to update society');
    } finally {
      setLoading(false);
    }
  };

  const [selectedAdmin, setSelectedAdmin] = useState<{ _id: string; name: string; email: string; permissions?: string[] } | null>(null);

  const handleCreateAdmin = async (values: CreateUserRequest) => {
    if (!selectedSociety) return;
    
    try {
      setLoading(true);
      let updatedSociety;

      if (selectedAdmin?._id) {
        // Update existing admin
        updatedSociety = await societyService.updateAdmin({
          _id: selectedAdmin._id,
          name: values.name,
          email: values.email,
          permissions: values.permissions
        });
        message.success('Admin updated successfully');
      } else {
        // Create new admin
        updatedSociety = await societyService.assignAdmin({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          permissions: values.permissions,
          societyId: selectedSociety._id,
          societyName: selectedSociety.name
        });
        message.success('Admin created successfully');
      }

      setSocieties(prev => prev.map(society => 
        society._id === selectedSociety._id ? updatedSociety : society
      ));
      setIsCreateAdminModalVisible(false);
      setSelectedSociety(null);
      setSelectedAdmin(null);
    } catch (error) {
      message.error(selectedAdmin?._id ? 'Failed to update admin' : 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async (adminData: { _id: string; name: string; email: string; permissions?: string[] }) => {
    if (adminData._id) {
      setSelectedAdmin(adminData);
      setIsCreateAdminModalVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      const updatedSociety = await societyService.updateAdmin(adminData);
      setSocieties(prev => prev.map(society => 
        society.adminId.some(admin => admin._id === adminData._id) ? updatedSociety : society
      ));
      setIsCreateAdminModalVisible(false);
      setSelectedAdmin(null);
      message.success('Admin details updated successfully');
    } catch (error) {
      message.error('Failed to update admin details');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (adminId: string) => {
    if (!selectedSociety) return;
    
    try {
      setLoading(true);
      await societyService.resetAdminPassword(selectedSociety._id, adminId);
      message.success('Admin password has been reset');
    } catch (error) {
      message.error('Failed to reset admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute permission="society.view">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Society Management</Title>
          {hasPermission('society.create') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              Create Society
            </Button>
          )}
        </div>

        <SocietyList
          societies={filteredSocieties}
          loading={loading}
          onEdit={(society) => {
            setSelectedSociety(society);
            setIsEditModalVisible(true);
          }}
          onView={(society) => {
            setSelectedSociety(society);
            setIsDetailModalVisible(true);
          }}
          onCreateAdmin={(society) => {
            setSelectedSociety(society);
            setSelectedAdmin(null);
            setIsCreateAdminModalVisible(true);
          }}
          hasPermission={hasPermission}
        />

        <CreateAndEditSociety
          isVisible={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          onSubmit={handleCreateSociety}
          mode="create"
        />

        <CreateAndEditSociety
          isVisible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedSociety(null);
          }}
          onSubmit={handleEditSociety}
          initialValues={selectedSociety || undefined}
          mode="edit"
        />

        <CreateAndEditAdmin
          isVisible={isCreateAdminModalVisible}
          onCancel={() => {
            setIsCreateAdminModalVisible(false);
            setSelectedSociety(null);
            setSelectedAdmin(null);
          }}
          onSubmit={handleCreateAdmin}
          society={selectedSociety}
          mode={selectedAdmin ? 'edit' : 'create'}
          initialValues={selectedAdmin || undefined}
        />

        <SocietyDetail
          isVisible={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedSociety(null);
          }}
          society={selectedSociety}
          onEditAdmin={handleEditAdmin}
          onResetPassword={handleResetPassword}
          hasPermission={hasPermission}
        />
      </Card>
    </ProtectedRoute>
  );
};

export default SocietyManagement;