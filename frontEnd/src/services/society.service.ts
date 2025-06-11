import axios from 'axios';
import { CreateSocietyRequest, Society } from '../types/society';
import { store } from '../store';

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
    return response.data.data;
  },

  getById: async (id: string): Promise<Society> => {
    const response = await axios.get(`${API_URL}/api/v1/societies/${id}`, getAuthHeader());
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateSocietyRequest>): Promise<Society> => {
    const response = await axios.put(`${API_URL}/api/v1/societies/${id}`, data, getAuthHeader());
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/societies/${id}`, getAuthHeader());
  },

  assignAdmin: async (id: string, adminId: string): Promise<Society> => {
    const response = await axios.put(`${API_URL}/api/v1/societies/${id}/assign-admin`, { adminId }, getAuthHeader());
    return response.data.data;
  }
};