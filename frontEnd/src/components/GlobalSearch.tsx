
import React, { useState, useEffect } from 'react';
import { Input, Modal, List, Avatar, Typography, Badge } from 'antd';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { Society } from '../types/society';
import { useAppSelector } from '../store/hooks';

const { Text } = Typography;

interface GlobalSearchProps {
  onSocietySelect: (society: Society) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSocietySelect }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Society[]>([]);

  // Mock societies data - replace with your backend API
  const mockSocieties: Society[] = [
    {
      id: '1',
      name: 'Green Valley Apartments',
      description: 'Modern residential complex with premium amenities',
      address: '123 Green Valley Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      contactEmail: 'admin@greenvalley.com',
      contactPhone: '+91 9876543210',
      totalUnits: 120,
      occupiedUnits: 95,
      adminId: '2',
      adminName: 'John Smith',
      adminEmail: 'john@greenvalley.com',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sunset Heights',
      description: 'Luxury high-rise with city views',
      address: '456 Sunset Boulevard',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      contactEmail: 'admin@sunsetheights.com',
      contactPhone: '+91 9876543211',
      totalUnits: 200,
      occupiedUnits: 180,
      adminId: '3',
      adminName: 'Jane Doe',
      adminEmail: 'jane@sunsetheights.com',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      status: 'active'
    }
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockSocieties.filter(society =>
        society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        society.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        society.adminName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchClick = () => {
    if (user && user.permissions.includes('society.view_all')) {
      setIsVisible(true);
    }
  };

  const handleSocietyClick = (society: Society) => {
    onSocietySelect(society);
    setIsVisible(false);
    setSearchTerm('');
  };

  if (!user || !user.permissions.includes('society.view_all')) {
    return null;
  }

  return (
    <>
      <Input
        placeholder="Search societies..."
        prefix={<SearchOutlined />}
        onClick={handleSearchClick}
        className="w-80 cursor-pointer"
        readOnly
      />
      
      <Modal
        title="Search Societies"
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={null}
        width={600}
      >
        <Input
          placeholder="Type to search societies..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          autoFocus
        />
        
        {searchResults.length > 0 && (
          <List
            dataSource={searchResults}
            renderItem={(society) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 rounded-lg p-3"
                onClick={() => handleSocietyClick(society)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={<HomeOutlined />} 
                      className="bg-blue-600"
                    />
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <span>{society.name}</span>
                      <Badge 
                        status={society.status === 'active' ? 'success' : 'error'} 
                        text={society.status}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <Text className="text-sm text-gray-600">
                        {society.city}, {society.state}
                      </Text>
                      <br />
                      <Text className="text-xs text-gray-500">
                        Admin: {society.adminName} | Units: {society.occupiedUnits}/{society.totalUnits}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
        
        {searchTerm && searchResults.length === 0 && (
          <div className="text-center py-8">
            <Text className="text-gray-500">No societies found matching your search.</Text>
          </div>
        )}
      </Modal>
    </>
  );
};

export default GlobalSearch;
