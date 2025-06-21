import Complaint from '../Models/Complaint.model.js';
import Society from '../Models/Society.model.js';
import { sendResponse } from '../Utils/SendResponse.js';

// Create a new complaint
export const createComplaint = async (req, res) => {
    try {
        if (req.user.role !== 'super_admin' && !req.user.societyId) {
            return sendResponse(res, 400, false, 'User is not associated with any society');
        }

        const complaint = await Complaint.create({
            ...req.body,
            residentId: req.user._id,
            societyId: req.user.societyId
        });
        
        const populatedComplaint = await complaint.populate([
            { path: 'residentId', select: 'name email' },
            { path: 'societyId', select: 'name' },
            { path: 'assignedTo', select: 'name email' }
        ]);

        return sendResponse(res, 201, 'Complaint created successfully', true, populatedComplaint);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const query = {};
        const { societyId } = req.query;
        if(societyId){
            query.societyId=societyId;
        }
        
        const complaints = await Complaint.find(query)
        .populate('residentId', 'name email')
        .populate('societyId', 'name')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
        console.log("queryu",complaints)

        return sendResponse(res, 200, 'Complaints fetched successfully', true, complaints);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

// Get complaint by ID
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('residentId', 'name email')
            .populate('societyId', 'name')
            .populate('assignedTo', 'name email')
            .populate('comments.createdBy', 'name email');

        if (!complaint) {
            return sendResponse(res, 404, 'Complaint not found', false);
        }

        return sendResponse(res, 200, 'Complaint fetched successfully', true, complaint);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

// Update complaint
export const updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return sendResponse(res, 404, 'Complaint not found', false);
        }

        // Only allow updates if user is admin/super_admin or the complaint creator
        if (req.user.role === 'resident' && complaint.residentId.toString() !== req.user._id.toString()) {
            return sendResponse(res, 403, 'Not authorized to update this complaint', false);
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate([
            { path: 'residentId', select: 'name email' },
            { path: 'societyId', select: 'name' },
            { path: 'assignedTo', select: 'name email' }
        ]);

        return sendResponse(res, 200, 'Complaint updated successfully', true, updatedComplaint);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

// Add comment to complaint
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return sendResponse(res, 400, 'Comment text is required', false);
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return sendResponse(res, 404, 'Complaint not found', false);
        }

        complaint.comments.push({
            text,
            createdBy: req.user._id
        });

        await complaint.save();

        const updatedComplaint = await Complaint.findById(req.params.id)
            .populate('residentId', 'name email')
            .populate('societyId', 'name')
            .populate('assignedTo', 'name email')
            .populate('comments.createdBy', 'name email');

        return sendResponse(res, 200, 'Comment added successfully', true, updatedComplaint);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};