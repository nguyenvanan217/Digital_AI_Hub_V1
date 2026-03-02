import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export const sendResponse = <T = any>(res: Response, statusCode: number, response: ApiResponse<T>): Response => {
    return res.status(statusCode).json(response);
};
