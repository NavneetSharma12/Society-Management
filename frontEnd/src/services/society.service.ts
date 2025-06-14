import axios from 'axios';
import { CreateSocietyRequest, Society } from '../types/society';
import { store } from '../store';
import { User } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  // const token = store.getState().auth.token;
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };
};

export const societyService = {
  create: async (data: CreateSocietyRequest): Promise<Society> => {
    const response = await axios.post(`${API_URL}/api/v1/societies`, data, getAuthHeader());
    return response.data.result;
  },

  getAll: async (): Promise<Society[]> => {
    const response = await axios.get(`${API_URL}/api/v1/societies`, getAuthHeader());
    return response.data.result;
  },

  getById: async (id: string): Promise<Society> => {
    const response = await axios.get(`${API_URL}/api/v1/societies/${id}`, getAuthHeader());
    return response.data.result;
  },

  update: async (id: string, data: Partial<CreateSocietyRequest>): Promise<Society> => {
    const response = await axios.put(`${API_URL}/api/v1/societies/${id}`, data, getAuthHeader());
    return response.data.result;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/societies/${id}`, getAuthHeader());
  },

  assignAdmin: async (data: Partial<User>): Promise<Society> => {
    const response = await axios.put(`${API_URL}/api/v1/societies/assign-admin`, { adminData: data }, getAuthHeader());
    return response.data.result;
  },

  updateAdmin: async (data: { _id: string; name: string; email: string; permissions?: string[] }): Promise<Society> => {
    const response = await axios.put(`${API_URL}/api/v1/societies/update-admin`, { adminData: data }, getAuthHeader());
    return response.data.result;
  },

  resetAdminPassword: async (societyId: string, adminId: string): Promise<void> => {
    await axios.post(
      `${API_URL}/api/v1/societies/${societyId}/admin/${adminId}/reset-password`,
      {},
      getAuthHeader()
    );
  }
};