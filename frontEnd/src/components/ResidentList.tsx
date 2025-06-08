
import React, { useState } from 'react';
import { Table, Input, Button, Tag, Avatar, Space, Card, Select, Dropdown, Menu } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  UserOutlined,
  ExportOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface Resident {
  id: string;
  name: string;
  email: string;
  unit: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  phone: string;
  role: 'Resident' | 'Moderator' | 'Admin';
}

// const ResidentList: React.FC = () => {
//   const [searchText, setSearchText] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   const residents: Resident[] = [
//     {
//       id: '1',
//       name: 'Sarah Johnson',
//       email: 'sarah.johnson@email.com',
//       unit: 'A-204',
//       status: 'Active',
//       joinDate: '2023-01-15',
//       phone: '+1 (555) 123-4567',
//       role: 'Resident'
//     },
//     {
//       id: '2',
//       name: 'Mike Chen',
//       email: 'mike.chen@email.com',
//       unit: 'B-105',
//       status: 'Active',
//       joinDate: '2023-03-22',
//       phone: '+1 (555) 234-5678',
//       role: 'Moderator'
//     },
//     {
//       id: '3',
//       name: 'Emily Davis',
//       email: 'emily.davis@email.com',
//       unit: 'C-301',
//       status: 'Active',
//       joinDate: '2023-02-10',
//       phone: '+1 (555) 345-6789',
//       role: 'Admin'
//     },
//     {
//       id: '4',
//       name: 'Alex Rodriguez',
//       email: 'alex.rodriguez@email.com',
//       unit: 'A-102',
//       status: 'Inactive',
//       joinDate: '2022-12-05',
//       phone: '+1 (555) 456-7890',
//       role: 'Resident'
//     },
//     {
//       id: '5',
//       name: 'Lisa Brown',
//       email: 'lisa.brown@email.com',
//       unit: 'B-203',
//       status: 'Pending',
//       joinDate: '2024-06-01',
//       phone: '+1 (555) 567-8901',
//       role: 'Resident'
//     }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active':
//         return 'green';
//       case 'Inactive':
//         return 'red';
//       case 'Pending':
//         return 'orange';
//       default:
//         return 'default';
//     }
//   };

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'Admin':
//         return 'purple';
//       case 'Moderator':
//         return 'blue';
//       case 'Resident':
//         return 'default';
//       default:
//         return 'default';
//     }
//   };

//   const actionMenu = (
//     <Menu>
//       <Menu.Item key="view" icon={<EyeOutlined />}>
//         View Details
//       </Menu.Item>
//       <Menu.Item key="edit" icon={<EditOutlined />}>
//         Edit Profile
//       </Menu.Item>
//       <Menu.Item key="export" icon={<ExportOutlined />}>
//         Export Data
//       </Menu.Item>
//     </Menu>
//   );

//   const columns = [
//     {
//       title: 'Resident',
//       dataIndex: 'name',
//       key: 'name',
//       render: (name: string, record: Resident) => (
//         <div className="flex items-center space-x-3">
//           <Avatar icon={<UserOutlined />} />
//           <div>
//             <div className="font-medium">{name}</div>
//             <div className="text-sm text-slate-500">{record.email}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Unit',
//       dataIndex: 'unit',
//       key: 'unit',
//       sorter: (a: Resident, b: Resident) => a.unit.localeCompare(b.unit),
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => (
//         <Tag color={getStatusColor(status)}>{status}</Tag>
//       ),
//       filters: [
//         { text: 'Active', value: 'Active' },
//         { text: 'Inactive', value: 'Inactive' },
//         { text: 'Pending', value: 'Pending' },
//       ],
//       onFilter: (value: any, record: Resident) => record.status === value,
//     },
//     {
//       title: 'Role',
//       dataIndex: 'role',
//       key: 'role',
//       render: (role: string) => (
//         <Tag color={getRoleColor(role)}>{role}</Tag>
//       ),
//     },
//     {
//       title: 'Join Date',
//       dataIndex: 'joinDate',
//       key: 'joinDate',
//       sorter: (a: Resident, b: Resident) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: () => (
//         <Dropdown overlay={actionMenu} trigger={['click']}>
//           <Button icon={<MoreOutlined />} />
//         </Dropdown>
//       ),
//     },
//   ];

//   const filteredResidents = residents.filter(resident => {
//     const matchesSearch = resident.name.toLowerCase().includes(searchText.toLowerCase()) ||
//                          resident.email.toLowerCase().includes(searchText.toLowerCase()) ||
//                          resident.unit.toLowerCase().includes(searchText.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || resident.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="space-y-6">
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
//           <div>
//             <h2 className="text-xl font-semibold text-slate-800">Resident Management</h2>
//             <p className="text-slate-600">Manage and view all resident profiles</p>
//           </div>
//           <Button type="primary" className="bg-blue-600">
//             Add New Resident
//           </Button>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <Input
//             placeholder="Search residents..."
//             prefix={<SearchOutlined />}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="sm:w-80"
//           />
//           <Select
//             value={statusFilter}
//             onChange={setStatusFilter}
//             className="w-full sm:w-40"
//           >
//             <Option value="all">All Status</Option>
//             <Option value="Active">Active</Option>
//             <Option value="Inactive">Inactive</Option>
//             <Option value="Pending">Pending</Option>
//           </Select>
//           <Button icon={<FilterOutlined />}>
//             More Filters
//           </Button>
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredResidents}
//           rowKey="id"
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} residents`,
//           }}
//           className="shadow-sm"
//         />
//       </Card>
//     </div>
//   );
// };

const ResidentList = () => {
  return (
    <div>ResidentList</div>
  )
}

export default ResidentList
