import mongoose from 'mongoose';

const facilityBookingSchema = new mongoose.Schema({
    facilityName: {
        type: String,
        required: [true, 'Facility name is required'],
        trim: true
    },
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Resident is required']
    },
    unitNumber: {
        type: String,
        required: [true, 'Unit number is required'],
        trim: true
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    timeSlot: {
        type: String,
        required: [true, 'Time slot is required'],
        trim: true
    },
    purpose: {
        type: String,
        required: [true, 'Purpose is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
        required: [true, 'Society is required']
    }
}, { timestamps: true });

export default mongoose.model('FacilityBooking', facilityBookingSchema);