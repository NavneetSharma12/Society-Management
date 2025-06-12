import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Society name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
        lowercase: true
    },
    contactPhone: {
        type: String,
        required: [true, 'Contact phone is required'],
        trim: true
    },
    totalUnits: {
        type: Number,
        required: [true, 'Total units is required'],
        min: [1, 'Total units must be at least 1']
    },
    occupiedUnits: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return value <= this.totalUnits;
            },
            message: 'Occupied units cannot exceed total units'
        }
    },
    adminId: [{
        type: String,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.model('Society', societySchema);