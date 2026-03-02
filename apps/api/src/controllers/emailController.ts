import { RequestHandler } from 'express';
import { sendResetPasswordEmail } from '../services/emailService';
import { sendResponse } from 'src/utils/responseHandler';

export const sendResetPassword: RequestHandler = async (req, res) => {
    try {
        const { email, fromApp } = req.body;

        if (!email) {
            throw new Error('Email không được để trống');
        }

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            throw new Error('Email chưa được đăng ký');
        }

        await sendResetPasswordEmail({ to: email, fromApp });

        sendResponse(res, 200, {
            success: true,
            message: 'Email đặt lại mật khẩu đã được gửi.',
            data: null,
        });
    } catch (error) {
        console.error('Error in createResource:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};
