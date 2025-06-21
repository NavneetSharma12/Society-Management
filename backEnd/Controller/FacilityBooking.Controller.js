import FacilityBooking from '../Models/FacilityBooking.model.js';
import { sendResponse } from '../Utils/SendResponse.js';
// import { sendResponse } from '../Utils/sendResponse.js';

export const createBooking = async (req, res) => {
    try {
        const { facilityName, unitNumber, bookingDate, timeSlot, purpose } = req.body;
        const booking = await FacilityBooking.create({
            facilityName,
            residentId: req.user._id,
            unitNumber,
            bookingDate,
            timeSlot,
            purpose,
            societyId: req.user.societyId
        });
        
        return sendResponse(res, 201, true, 'Booking created successfully', booking);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

export const getBookings = async (req, res) => {
    try {
        let query = {};
        
        const { societyId } = req.query;
        if(societyId){
            query.societyId=societyId;
        }
        
        const bookings = await FacilityBooking.find(query)
            .populate('residentId', 'name')
            .populate('societyId', 'name')
            .sort({ createdAt: -1 });
            
        return sendResponse(res, 200, true, 'Bookings fetched successfully', bookings);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const booking = await FacilityBooking.findById(bookingId);
        if (!booking) {
            return sendResponse(res, 404, false, 'Booking not found');
        }
        console.log(booking)
        
        
        booking.status = status;
        await booking.save();
        
        return sendResponse(res, 200, true, 'Booking status updated successfully', booking);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};