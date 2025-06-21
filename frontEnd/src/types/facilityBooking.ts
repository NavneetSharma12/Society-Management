import { Society } from "./society";

export interface FacilityBookingViewModel {
  id: string;
  _id?:string;
  facilityName: string;
  residentName: string;
  unitNumber: string;
  bookingDate: string;
  timeSlot: string;
  purpose: string;
  status: BookingStatus;
  societyId: Society;
  societyName: string;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface CreateBookingRequest {
  facilityName: string;
  unitNumber: string;
  bookingDate: string;
  timeSlot: string;
  purpose: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  result: FacilityBookingViewModel[];
}

export interface SingleBookingResponse {
  success: boolean;
  message: string;
  result: FacilityBookingViewModel;
}