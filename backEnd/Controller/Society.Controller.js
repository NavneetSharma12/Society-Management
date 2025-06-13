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
        const societies = await Society.find().populate('adminId', 'name email permissions');
        return sendResponse(res, 200, 'Societies fetched successfully', true, societies);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

const getSocietyById = async (req, res) => {
    try {
        const society = await Society.findById(req.params.id).populate('adminId', 'name email permissions');
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

import bcrypt from 'bcrypt';

const assignAdmin = async (req, res) => {
    try {
        const adminData = req.body.adminData;
        console.log("adminData", adminData)
        if (!adminData) {
            return sendResponse(res, 400, 'Admin data is required', false);
        }


        const existingUser = await User.findOne({ email: adminData.email });
        if (existingUser) {
            return sendResponse(res, 400, 'Email already in use', false);
        }

        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const user = await User.create({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            permissions: adminData.permissions,
            role: adminData.role,
        });

        const society = await Society.findByIdAndUpdate(
            adminData.societyId,
            { $push: { adminId: user._id } },
            { new: true, runValidators: true }
        ).populate('adminId', 'name email');

        if (!society) {
            await User.findByIdAndDelete(user._id); // Cleanup if society not found
            return sendResponse(res, 404, 'Society not found', false);
        }

        return sendResponse(res, 200, 'Admin assigned successfully', true, society);
    } catch (error) {
        return sendResponse(res, 400, error.message, false);
    }
};

export const resetAdminPassword = async (req, res) => {
    try {
        const { societyId, adminId } = req.params;

        // Find the society and check if the admin belongs to it
        const society = await Society.findById(societyId).populate('adminId');
        if (!society) {
            return sendResponse(res, 404, 'Society not found', false);
        }

        // Check if the adminId exists in the society's adminId array
        const isAdminOfSociety = society.adminId.some(admin => admin._id.toString() === adminId);
        if (!isAdminOfSociety) {
            return sendResponse(res, 404, 'Admin not found in this society', false);
        }

        // Generate a random password
        const newPassword ="welcome";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password
        await User.findByIdAndUpdate(adminId, { password: hashedPassword });

        return sendResponse(res, 200, `Password has been reset to: ${newPassword}`, true);
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