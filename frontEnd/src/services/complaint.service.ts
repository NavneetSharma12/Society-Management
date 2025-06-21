import axios from 'axios';
// import { API_URL } from '../config/constants';

interface Comment {
  text: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  residentId: {
    _id: string;
    name: string;
    email: string;
  };
  societyId: {
    _id: string;
    name: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface CreateComplaintRequest {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  societyId: string;
}

interface UpdateComplaintRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
}

interface AddCommentRequest {
  text: string;
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

const API_URL =  import.meta.env.VITE_API_URL  || 'http://localhost:8000';
const complaintService = {
  // Create a new complaint
  createComplaint: async (data: CreateComplaintRequest) => {
    const response = await axios.post(`${API_URL}/api/v1/complaints`, data,getAuthHeader());
    return response.data;
  },

  // Get all complaints
  getAllComplaints: async (societyId?: string): Promise<{ success: boolean; message: string; result: Complaint[] }> => {
    const url = societyId? 
    `${API_URL}/api/v1/complaints?societyId=${societyId}`:
    `${API_URL}/api/v1/complaints`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // Get complaint by ID
  getComplaintById: async (id: string): Promise<{ success: boolean; message: string; result: Complaint }> => {
    const response = await axios.get(`${API_URL}/api/v1/complaints/${id}`,getAuthHeader());
    return response.data;
  },

  // Update complaint
  updateComplaint: async (id: string, data: UpdateComplaintRequest): Promise<{ success: boolean; message: string; result: Complaint }> => {
    const response = await axios.put(`${API_URL}/api/v1/complaints/${id}`, data,getAuthHeader());
    return response.data;
  },

  // Add comment to complaint
  addComment: async (complaintId: string, data: AddCommentRequest): Promise<{ success: boolean; message: string; result: Complaint }> => {
    const response = await axios.post(`${API_URL}/api/v1/complaints/${complaintId}/comments`, data,getAuthHeader());
    return response.data;
  }
};

export default complaintService;