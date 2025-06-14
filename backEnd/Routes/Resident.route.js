import express from 'express';
import {
    createResident,
    getAllResidents,
    getResidentById,
    updateResident,
    deleteResident,
    getResidentsBySociety
} from '../Controller/Resident.Controller.js';
import isAuthenticated from '../Middlewares/IsAuthenticated.js';

const router = express.Router();

// Create a new resident
router.post('/', isAuthenticated, createResident);

// Get all residents
router.get('/', isAuthenticated, getAllResidents);

// Get resident by ID
router.get('/:id', isAuthenticated, getResidentById);

// Update resident
router.put('/:id', isAuthenticated, updateResident);

// Delete resident
router.delete('/:id', isAuthenticated, deleteResident);

// Get residents by society ID
router.get('/society/:societyId', isAuthenticated, getResidentsBySociety);

export default router;