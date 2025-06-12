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
    : societies.filter(society => society.adminId === user?.id);

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

  const handleCreateAdmin = async (values: CreateUserRequest) => {
    if (!selectedSociety) return;
    
    try {
      setLoading(true);
      const updatedSociety = await societyService.assignAdmin({
        ...values,
        societyId: selectedSociety._id,
        societyName: selectedSociety.name
      });

      // const updatedSociety = await societyService.assignAdmin(selectedSociety._id, values);
      setSocieties(prev => prev.map(society => 
        society._id === selectedSociety._id ? updatedSociety : society
      ));
      setIsCreateAdminModalVisible(false);
      setSelectedSociety(null);
      message.success('Admin assigned successfully');
    } catch (error) {
      message.error('Failed to assign admin');
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
          }}
          onSubmit={handleCreateAdmin}
          society={selectedSociety}
          mode="create"
        />

        <SocietyDetail
          isVisible={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedSociety(null);
          }}
          society={selectedSociety}
          onEditAdmin={() => {
            setIsDetailModalVisible(false);
            setIsCreateAdminModalVisible(true);
          }}
          hasPermission={hasPermission}
        />
      </Card>
    </ProtectedRoute>
  );
};

export default SocietyManagement;