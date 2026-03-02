import { RequestHandler } from 'express';
import topicService from '../services/topicService';
import { sendResponse } from '../utils/responseHandler';
import { CreatedTopicInput, UpdateTopicInput } from '../types/topic';

const createTopic: RequestHandler = async (req, res) => {
    try {
        const newTopic = req.body as CreatedTopicInput;
        const createdTopic = await topicService.createTopic(newTopic);

        sendResponse(res, 200, {
            success: true,
            message: 'Tạo topic mới thành công',
            data: createdTopic,
        });
    } catch (error: unknown) {
        console.error('Error in createTopic:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getTopics: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = (req.query.search as string) || '';
        const typeId = (req.query.typeId as string) || undefined;

        const result = await topicService.getTopics({ page, pageSize, search, typeId });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách topic thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getTopics:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const deleteTopic: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const topicId = parseInt(id);

        if (isNaN(topicId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        const deletedTopic = await topicService.deleteTopic(topicId);

        sendResponse(res, 200, {
            success: true,
            message: 'Xóa topic thành công',
            data: deletedTopic,
        });
    } catch (error: unknown) {
        console.error('Error in deleteTopic:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Topic không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const getTopicBySlug: RequestHandler = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return sendResponse(res, 400, {
                success: false,
                message: 'Slug không được để trống',
                error: 'Slug is required',
            });
        }

        const result = await topicService.getTopicBySlug(slug);

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy thông tin topic thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getTopicBySlug:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Topic không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const updateTopic: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const topicId = parseInt(id);
        const updateData = req.body as UpdateTopicInput;

        if (isNaN(topicId)) {
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

        const updatedTopic = await topicService.updateTopic(topicId, updateData);

        sendResponse(res, 200, {
            success: true,
            message: 'Cập nhật topic thành công',
            data: updatedTopic,
        });
    } catch (error: unknown) {
        console.error('Error in updateTopic:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Topic không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export default {
    createTopic,
    getTopics,
    getTopicBySlug,
    deleteTopic,
    updateTopic,
};
