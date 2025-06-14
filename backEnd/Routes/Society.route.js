import express from 'express';
import {
    createSociety,
    getAllSocieties,
    getSocietyById,
    updateSociety,
    deleteSociety,
    assignAdmin,
    resetAdminPassword,
    updateAdmin
} from '../Controller/Society.Controller.js';
import isAuthenticated from '../Middlewares/IsAuthenticated.js';

const router = express.Router();

// Protected routes - require authentication
router.use(isAuthenticated);

// CRUD routes
router.post('/', createSociety);
router.get('/', getAllSocieties);
router.put('/assign-admin', assignAdmin);
router.put('/update-admin', updateAdmin);
router.post('/:societyId/admin/:adminId/reset-password', resetAdminPassword);
router.get('/:id', getSocietyById);
router.put('/:id', updateSociety);
router.delete('/:id', deleteSociety);

export default router;