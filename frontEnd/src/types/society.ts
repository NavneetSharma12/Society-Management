
export interface Society {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  totalUnits: number;
  occupiedUnits: number;
  adminId: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface CreateSocietyRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  totalUnits: number;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}
