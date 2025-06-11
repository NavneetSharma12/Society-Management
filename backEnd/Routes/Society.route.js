import express from 'express';
import {
    createSociety,
    getAllSocieties,
    getSocietyById,
    updateSociety,
    deleteSociety,
    assignAdmin
} from '../Controller/Society.Controller.js';
import isAuthenticated from '../Middlewares/IsAuthenticated.js';

const router = express.Router();

// Protected routes - require authentication
router.use(isAuthenticated);

// CRUD routes
router.post('/', createSociety);
router.get('/', getAllSocieties);
router.get('/:id', getSocietyById);
router.put('/:id', updateSociety);
router.delete('/:id', deleteSociety);
router.put('/:id/assign-admin', assignAdmin);

export default router;