import express from 'express';
import {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaint,
    addComment
} from '../Controller/Complaint.Controller.js';
import isAuthenticated from '../Middlewares/IsAuthenticated.js';

const router = express.Router();

// Protect all routes
router.use(isAuthenticated);

// Create a new complaint
router.post('/', createComplaint);

// Get all complaints
router.get('/', getAllComplaints);

// Get complaint by ID
router.get('/:id', getComplaintById);

// Update complaint
router.put('/:id', updateComplaint);

// Add comment to complaint
router.post('/:id/comments', addComment);

export default router;