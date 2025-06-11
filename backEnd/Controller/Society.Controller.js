import Society from '../Models/Society.model.js';
import User from '../Models/User.Model.js';
import { sendResponse } from '../Utils/SendResponse.js';

export const createSociety = async (req, res) => {
    try {
        const society = await Society.create(req.body);
        return sendResponse(res, 201, 'Society created successfully', true, society);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const getAllSocieties = async (req, res) => {
    try {
        const societies = await Society.find().populate('adminId', 'name email');
        return sendResponse(res, 200, 'Societies fetched successfully', true, societies);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const getSocietyById = async (req, res) => {
    try {
        const society = await Society.findById(req.params.id).populate('adminId', 'name email');
        if (!society) {
            return sendResponse(res, 404, 'Society not found', false);
        }
        return sendResponse(res, 200, 'Society fetched successfully', true, society);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const updateSociety = async (req, res) => {
    try {
        const { adminId, ...updateData } = req.body;
        let society;

        if (adminId) {
            // If adminId is provided, validate it exists in User model
            const admin = await User.findById(adminId);
            if (!admin) {
                return sendResponse(res, 404, 'Admin user not found', false);
            }
            if (!admin.permissions.includes('society.admin')) {
                return sendResponse(res, 403, 'User does not have admin permissions', false);
            }
        }

        society = await Society.findByIdAndUpdate(
            req.params.id,
            { ...updateData, ...(adminId && { adminId }) },
            { new: true, runValidators: true }
        ).populate('adminId', 'name email');

        if (!society) {
            return sendResponse(res, 404, 'Society not found', false);
        }

        return sendResponse(res, 200, 'Society updated successfully', true, society);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const deleteSociety = async (req, res) => {
    try {
        const society = await Society.findByIdAndDelete(req.params.id);
        if (!society) {
            return sendResponse(res, 404, 'Society not found', false);
        }
        return sendResponse(res, 200, 'Society deleted successfully', true);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const assignAdmin = async (req, res) => {
    try {
        const { adminId } = req.body;
        if (!adminId) {
            return sendResponse(res, 400, 'Admin ID is required', false);
        }

        // Validate admin user exists and has proper permissions
        const admin = await User.findById(adminId);
        if (!admin) {
            return sendResponse(res, 404, 'Admin user not found', false);
        }
        if (!admin.permissions.includes('society.admin')) {
            return sendResponse(res, 403, 'User does not have admin permissions', false);
        }

        const society = await Society.findByIdAndUpdate(
            req.params.id,
            { adminId },
            { new: true, runValidators: true }
        ).populate('adminId', 'name email');

        if (!society) {
            return sendResponse(res, 404, 'Society not found', false);
        }

        return sendResponse(res, 200, 'Admin assigned successfully', true, society);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export {
    getAllSocieties,
    getSocietyById,
    updateSociety,
    deleteSociety,
    assignAdmin
};