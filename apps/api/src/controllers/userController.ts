import { RequestHandler } from 'express';
import userService from '../services/userService';
import { sendResponse } from '../utils/responseHandler';
import { CreatedUserInput, UpdateUserInput } from '../types/user';
import { verifyJWT } from 'src/middleware/jwtAction';

const createUser: RequestHandler = async (req, res) => {
    try {
        const newUser = req.body as CreatedUserInput;
        const createdUser = await userService.createUser(newUser);

        sendResponse(res, 200, {
            success: true,
            message: 'Tạo người dùng mới thành công',
            data: createdUser,
        });
    } catch (error: unknown) {
        console.error('Error in createUser:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getUsers: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = (req.query.search as string) || '';

        const result = await userService.getUsers({ page, pageSize, search });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách người dùng thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const deleteUser: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            return sendResponse(res, 401, { success: false, message: 'Unauthorized', error: 'No token' });
        }

        const userVerify = verifyJWT(token);

        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        if (userVerify?.id === userId) {
            return sendResponse(res, 400, {
                success: false,
                message: 'Không thể xóa chính bạn',
                error: 'Không thể xóa chính bạn',
            });
        }

        const deletedUser = await userService.deleteUser(userId);

        sendResponse(res, 200, {
            success: true,
            message: 'Xóa người dùng thành công',
            data: deletedUser,
        });
    } catch (error: unknown) {
        console.error('Error in deleteUser:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Người dùng không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const updateUser: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const updateData = req.body as UpdateUserInput;

        if (isNaN(userId)) {
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

        const updatedUser = await userService.updateUser(userId, updateData);

        sendResponse(res, 200, {
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: updatedUser,
        });
    } catch (error: unknown) {
        console.error('Error in updateUser:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Người dùng không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export default {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
};
