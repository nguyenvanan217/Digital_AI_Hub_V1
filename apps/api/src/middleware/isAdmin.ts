import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseHandler';

export const checkIsAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!user || user.role !== 'admin') {
        sendResponse(res, 403, {
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này!',
            error: 'Not authorized',
        });
        return;
    }

    next();
};
