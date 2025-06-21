import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../Controller/FacilityBooking.Controller.js';
import IsAuthenticated from '../Middlewares/IsAuthenticated.js';

const router = express.Router();

// Create a new booking
router.post('/', IsAuthenticated, createBooking);

// Get all bookings (filtered based on user role)
router.get('/', IsAuthenticated, getBookings);

// Update booking status
router.patch('/:bookingId/status', IsAuthenticated, updateBookingStatus);

export default router;