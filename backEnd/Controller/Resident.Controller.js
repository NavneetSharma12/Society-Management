import Resident from '../Models/Resident.model.js';
import { sendResponse } from '../Utils/SendResponse.js';

export const createResident = async (req, res) => {
    try {
        const resident = await Resident.create(req.body);
        return sendResponse(res, 201, 'Resident created successfully', true, resident);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const getAllResidents = async (req, res) => {
    try {
        const residents = await Resident.find()
            .populate('societyId', 'name city state')
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, 'Residents fetched successfully', true, residents);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const getResidentById = async (req, res) => {
    try {
        const resident = await Resident.findById(req.params.id)
            .populate('societyId', 'name city state');
        if (!resident) {
            return sendResponse(res, 404, 'Resident not found', false);
        }
        return sendResponse(res, 200, 'Resident fetched successfully', true, resident);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const updateResident = async (req, res) => {
    try {
        const resident = await Resident.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('societyId', 'name city state');

        if (!resident) {
            return sendResponse(res, 404, 'Resident not found', false);
        }

        return sendResponse(res, 200, 'Resident updated successfully', true, resident);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const deleteResident = async (req, res) => {
    try {
        const resident = await Resident.findByIdAndDelete(req.params.id);
        if (!resident) {
            return sendResponse(res, 404, 'Resident not found', false);
        }
        return sendResponse(res, 200, 'Resident deleted successfully', true);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const getResidentsBySociety = async (req, res) => {
    try {
        const residents = await Resident.find({ societyId: req.params.societyId })
            .populate('societyId', 'name')
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, 'Residents fetched successfully', true, residents);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};