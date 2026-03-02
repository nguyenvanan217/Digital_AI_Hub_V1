import { RequestHandler } from 'express';
import bannerService from '../services/bannerService';
import { sendResponse } from '../utils/responseHandler';
import { CreatedBannerInput, UpdateBannerInput } from '../types/banner';

const createBanner: RequestHandler = async (req, res) => {
    try {
        const newBanner = req.body as CreatedBannerInput;
        const createdBanner = await bannerService.createBanner(newBanner);

        sendResponse(res, 200, {
            success: true,
            message: 'Tạo banner mới thành công',
            data: createdBanner,
        });
    } catch (error: unknown) {
        console.error('Error in createBanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export const getBanners: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await bannerService.getBanners({ page, pageSize });

        sendResponse(res, 200, {
            success: true,
            message: 'Lấy danh sách banner thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error in getBanners:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const deleteBanner: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const bannerId = parseInt(id);

        if (isNaN(bannerId)) {
            return sendResponse(res, 400, {
                success: false,
                message: 'ID không hợp lệ',
                error: 'ID must be a number',
            });
        }

        const deletedBanner = await bannerService.deleteBanner(bannerId);

        sendResponse(res, 200, {
            success: true,
            message: 'Xóa banner thành công',
            data: deletedBanner,
        });
    } catch (error: unknown) {
        console.error('Error in deleteBanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Banner không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

const updateBanner: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const bannerId = parseInt(id);
        const updateData = req.body as UpdateBannerInput;

        if (isNaN(bannerId)) {
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

        const updatedBanner = await bannerService.updateBanner(bannerId, updateData);

        sendResponse(res, 200, {
            success: true,
            message: 'Cập nhật banner thành công',
            data: updatedBanner,
        });
    } catch (error: unknown) {
        console.error('Error in updateBanner:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, error instanceof Error && error.message === 'Banner không tồn tại' ? 404 : 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};

export default {
    createBanner,
    getBanners,
    deleteBanner,
    updateBanner,
};
