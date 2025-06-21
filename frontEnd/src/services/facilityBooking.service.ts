import axios from 'axios';
const API_URL =  import.meta.env.VITE_API_URL  || 'http://localhost:8000/api/v1';
interface CreateBookingData {
  facilityName: string;
  unitNumber: string;
  bookingDate: string;
  timeSlot: string;
  purpose: string;
}

interface UpdateBookingStatusData {
  status: 'approved' | 'rejected';
}

const FacilityBookingService = {
  createBooking: async (data: CreateBookingData) => {
    const response = await axios.post(`${API_URL}/facility-bookings`, data, {
      withCredentials: true
    });
    return response.data;
  },

  getBookings: async (societyId: string | null) => {
    let url=`${API_URL}/facility-bookings`
    if (societyId) {
      url+=`?societyId=${societyId}`
    }
    const response = await axios.get(url, {
      withCredentials: true
    });
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, data: UpdateBookingStatusData) => {
    const response = await axios.patch(
      `${API_URL}/facility-bookings/${bookingId}/status`,
      data,
      { withCredentials: true }
    );
    return response.data;
  }
};

export default FacilityBookingService;