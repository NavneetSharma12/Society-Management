
import { Permission, Role } from './permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  password:string;
  role: Role;
  permissions: Permission[];
  societyId?: string;
  societyName?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  phone?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  societyId: string;
  permissions: Permission[];
  phone?: string;
}

export interface Resident {
  id: string;
  _id:string;
  name: string;
  email: string;
  phone: string;
  unitNumber: string;
  societyId: any;
  societyName: string;
  moveInDate: Date;
  status: 'active' | 'inactive' ;
  isOwner: boolean;
  profileImage?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;
}

export interface MemberRequest {
  id: string;
  residentName: string;
  email: string;
  phone: string;
  unitNumber: string;
  societyId: string;
  societyName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  notes?: string;
}
