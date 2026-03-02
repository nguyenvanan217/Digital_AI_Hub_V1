import { RequestHandler } from 'express';
import resourceService from '../services/resourceService';
import { sendResponse } from '../utils/responseHandler';
import { CreatedResourceInput, UpdateResourceInput } from '../types/resource';
import { verifyJWT } from 'src/middleware/jwtAction';

const createResource: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            return sendResponse(res, 401, { success: false, message: 'Unauthorized', error: 'No token' });
        }

        const userVerify = verifyJWT(token);

        const newResource = req.body as CreatedResourceInput;
        const createdResource = await resourceService.createResource({ data: newResource, userVerify });

        sendResponse(res, 200, {
            success: true,
            message: 'Tạo tài nguyên mới thành công',
            data: createdResource,
        });
    } catch (error: unknown) {
        console.error('Error in createResource:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getResourceBySlug: RequestHandler = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Slug is required',
            });
        }

        const result = await resourceService.getResourceBySlug(slug);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found',
            });
        }

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error fetching resource by slug:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resource',
        });
    }
};

export const getResources: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = (req.query.search as string) || '';
        const topicId = (req.query.topicId as string) || undefined;
        const topicSlug = (req.query.topicSlug as string) || undefined;
        const status = (req.query.status as 'active' | 'inactive') || undefined;

        const result = await resourceService.getResources({ page, pageSize, search, topicId, topicSlug, status });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách tài nguyên thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getResources:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getMyResources: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            return sendResponse(res, 401, { success: false, message: 'Unauthorized', error: 'No token' });
        }

        const userVerify = verifyJWT(token);

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = (req.query.search as string) || '';
        const topicId = (req.query.topicId as string) || undefined;
        const status = (req.query.status as 'active' | 'inactive') || undefined;

        const result = await resourceService.getMyResources({ page, pageSize, search, topicId, userVerify, status });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách tài nguyên thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getResources:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const deleteResource: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const resourceId = parseInt(id);

        const token = req.cookies['access_token'];

        if (!token) {
            return sendResponse(res, 401, { success: false, message: 'Unauthorized', error: 'No token' });
        }

        const userVerify = verifyJWT(token);

        if (isNaN(resourceId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        const deletedResource = await resourceService.deleteResource(resourceId, userVerify);

        sendResponse(res, 200, {
            success: true,
            message: 'Xóa tài nguyên thành công',
            data: deletedResource,
        });
    } catch (error: unknown) {
        console.error('Error in deleteResource:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Tài nguyên không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const updateResource: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            return sendResponse(res, 401, { success: false, message: 'Unauthorized', error: 'No token' });
        }

        const userVerify = verifyJWT(token);

        const { id } = req.params;
        const resourceId = parseInt(id);
        const updateData = req.body as UpdateResourceInput;

        if (isNaN(resourceId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        if (Object.keys(updateData).length === 0) {
            return sendResponse(res, 400, {
                success: false,
                message: 'Không có dữ liệu cập nhật',
                error: 'Update data cannot be empty',
            });
        }

        const updatedResource = await resourceService.updateResource(resourceId, updateData, userVerify);

        sendResponse(res, 200, {
            success: true,
            message: 'Cập nhật tài nguyên thành công',
            data: updatedResource,
        });
    } catch (error: unknown) {
        console.error('Error in updateResource:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Tài nguyên không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const approveResource: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const resourceId = parseInt(id);

        if (isNaN(resourceId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }
        const approvedResource = await resourceService.approveResource(resourceId);
        sendResponse(res, 200, {
            success: true,
            message: 'Duyệt tài nguyên thành công',
            data: approvedResource,
        });
    } catch (error: unknown) {
        console.error('Error in approveResource:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Tài nguyên không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export default {
    createResource,
    getResources,
    getMyResources,
    deleteResource,
    updateResource,
    getResourceBySlug,
    approveResource,
};
