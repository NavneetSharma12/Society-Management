import mongoose from 'mongoose';

const residentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    unitNumber: {
        type: String,
        required: [true, 'Unit number is required'],
        trim: true
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
        required: [true, 'Society reference is required']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    moveInDate: {
        type: Date,
        required: [true, 'Move-in date is required']
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    documents: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Resident = mongoose.model('Resident', residentSchema);

export default Resident;