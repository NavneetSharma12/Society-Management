import Society from '../Models/Society.model.js';
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
        const society = await Society.findByIdAndUpdate(
            req.params.id,
            req.body,
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

export {
    getAllSocieties,
    getSocietyById,
    updateSociety,
    deleteSociety
};