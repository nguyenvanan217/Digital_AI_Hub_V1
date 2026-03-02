import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendResponse } from '../utils/responseHandler';
dotenv.config();

export interface JwtPayload {
     id: number;
    email: string;
    role: 'admin' | 'teacher';
}

export const createJWT = (payload: JwtPayload): string | null => {
    const key = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE || '2h';

    if (!key) {
        console.error('JWT_SECRET is not defined');
        return null;
    }

    try {
        return jwt.sign(payload, key, {
            expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
        });
    } catch (error) {
        console.log('error createJWT', error);
        return null;
    }
};

export const verifyJWT = (token: string): JwtPayload | null => {
    const key = process.env.JWT_SECRET as string;
    try {
        return jwt.verify(token, key) as JwtPayload;
    } catch (error) {
        console.log('error verifyJWT', error);
        return null;
    }
};

export const checkUserJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            sendResponse(res, 401, {
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện thao tác này!',
                error: 'No token provided',
            });
            return;
        }

        const decoded = verifyJWT(token);
        if (!decoded) {
            res.clearCookie('access_token');
            sendResponse(res, 401, {
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn!',
                error: 'Invalid token',
            });
            return;
        }

        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        console.log('error checkUserJWT', error);
        sendResponse(res, 500, {
            success: false,
            message: 'Internal server error',
            error: 'Server error',
        });
    }
};
