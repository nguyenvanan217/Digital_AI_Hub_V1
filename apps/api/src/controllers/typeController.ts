import { RequestHandler } from 'express';
import typeService from '../services/typeService';
import { sendResponse } from '../utils/responseHandler';
import { CreatedTypeInput, UpdateTypeInput } from '../types/type';

const createType: RequestHandler = async (req, res) => {
    try {
        const newType = req.body as CreatedTypeInput;
        const createdType = await typeService.createType(newType);

        sendResponse(res, 200, {
            success: true,
            message: 'Tạo loại tài nguyên mới thành công',
            data: createdType,
        });
    } catch (error: unknown) {
        console.error('Error in createType:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getTypes: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await typeService.getTypes({ page, pageSize });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách loại tài nguyên thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getTypes:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const deleteType: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const typeId = parseInt(id);

        if (isNaN(typeId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        const deletedType = await typeService.deleteType(typeId);

        sendResponse(res, 200, {
            success: true,
            message: 'Xóa loại tài nguyên thành công',
            data: deletedType,
        });
    } catch (error: unknown) {
        console.error('Error in deleteType:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Loại tài nguyên không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const updateType: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const typeId = parseInt(id);
        const updateData = req.body as UpdateTypeInput;

        if (isNaN(typeId)) {
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

        const updatedType = await typeService.updateType(typeId, updateData);

        sendResponse(res, 200, {
            success: true,
            message: 'Cập nhật loại tài nguyên thành công',
            data: updatedType,
        });
    } catch (error: unknown) {
        console.error('Error in updateType:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Loại tài nguyên không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export default {
    createType,
    getTypes,
    deleteType,
    updateType,
};
