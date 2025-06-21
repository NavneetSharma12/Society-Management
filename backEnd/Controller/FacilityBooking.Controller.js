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
        
        // Only admin and super_admin can update status
        if (!['admin', 'super_admin'].includes(req.user.role)) {
            return sendResponse(res, 403, false, 'Unauthorized to perform this action');
        }
        
        const booking = await FacilityBooking.findById(bookingId);
        if (!booking) {
            return sendResponse(res, 404, false, 'Booking not found');
        }
        
        // Admin can only update bookings from their society
        if (req.user.role === 'admin' && booking.societyId.toString() !== req.user.societyId.toString()) {
            return sendResponse(res, 403, false, 'Unauthorized to update this booking');
        }
        
        booking.status = status;
        await booking.save();
        
        return sendResponse(res, 200, true, 'Booking status updated successfully', booking);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};