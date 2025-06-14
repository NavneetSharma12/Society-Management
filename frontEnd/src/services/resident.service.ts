import axios from 'axios';

const API_URL =  import.meta.env.VITE_API_URL  || 'http://localhost:8000/api/v1';

export interface Resident {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    unitNumber: string;
    societyId: string;
    status: 'active' | 'inactive';
    moveInDate: Date;
    isOwner: boolean;
    documents?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
const getAuthHeader = () => {
    // const token = store.getState().auth.token;
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
  };

export const residentService = {
    createResident: async (residentData: Omit<Resident, '_id'>) => {
        const response = await axios.post(
            `${API_URL}/residents`,
            residentData,getAuthHeader() 
        );
        return response.data;
    },

    getAllResidents: async () => {
        const response = await axios.get(
            `${API_URL}/residents`,getAuthHeader() 
        );
        return response.data;
    },

    getResidentById: async (id: string) => {
        const response = await axios.get(
            `${API_URL}/residents/${id}`, getAuthHeader() 
        );
        return response.data;
    },

    updateResident: async (id: string, residentData: Partial<Resident>) => {
        const response = await axios.put(
            `${API_URL}/residents/${id}`,
            residentData, getAuthHeader() 
        );
        return response.data;
    },

    deleteResident: async (id: string) => {
        const response = await axios.delete(
            `${API_URL}/residents/${id}`,getAuthHeader() 
        );
        return response.data;
    },

    getResidentsBySociety: async (societyId: string) => {
        const response = await axios.get(
            `${API_URL}/residents/society/${societyId}`,getAuthHeader() 
        );
        return response.data;
    }
};