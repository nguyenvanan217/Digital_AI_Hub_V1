import { RequestHandler } from 'express';
import authService from '../services/authService';
import { sendResponse } from '../utils/responseHandler';
import { RegisterInput, LoginInput } from '../types/auth';
import { verifyJWT } from 'src/middleware/jwtAction';

export const registerController: RequestHandler = async (req, res) => {
    try {
        const registerData = req.body as RegisterInput;

        const newUser = await authService.register(registerData);

        sendResponse(res, 201, {
            success: true,
            message: 'Đăng ký thành công',
            data: newUser,
        });
    } catch (error: unknown) {
        console.error('Error in register:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        const statusCode =
            error instanceof Error && errorMessage.includes('đầy đủ thông tin')
                ? 400
                : error instanceof Error && errorMessage.includes('đã được sử dụng')
                    ? 409
                    : 500;

        sendResponse(res, statusCode, {
            success: false,
            message: errorMessage,
            error: errorMessage,
        });
    }
};
export const loginController: RequestHandler = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('Thiếu username hoặc password');
        }

        const loginData: LoginInput = { username, password };
        const user = await authService.loginUser(loginData);

        res.cookie('access_token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.cookie('logged_in_user', user.email, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return sendResponse(res, 200, {
            success: true,
            message: 'Đăng nhập thành công',
            data: user.token,
        });
    } catch (error) {
        console.error('Error in loginController:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 500, {
            success: false,
            message: 'Có lỗi xảy ra khi đăng nhập',
            error: errorMessage,
        });
    }
};
export const getAccount: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];
        if (!token) {
            return sendResponse(res, 401, {
                success: false,
                message: 'Thiếu token xác thực',
                error: 'No token provided',
            });
        }

        const payload = verifyJWT(token);
        if (!payload || !payload.id) {
            return sendResponse(res, 401, {
                success: false,
                message: 'Token không hợp lệ',
                error: 'Invalid token',
            });
        }

        // Find user with Drizzle query
        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id as number),
        });

        if (!user) {
            return sendResponse(res, 404, {
                success: false,
                message: 'Người dùng không tồn tại',
                error: 'User not found',
            });
        }

        // Remove sensitive data
        const userWithoutPassword = omit(user, ['password']);

        return sendResponse(res, 200, {
            success: true,
            message: 'Lấy thông tin tài khoản thành công',
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error: unknown) {
        console.error('Error in getAccount:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        const statusCode =
            error instanceof Error && errorMessage.includes('token')
                ? 401
                : error instanceof Error && errorMessage.includes('không tồn tại')
                    ? 404
                    : 500;

        return sendResponse(res, statusCode, {
            success: false,
            message: 'Có lỗi xảy ra khi lấy thông tin tài khoản',
            error: errorMessage,
        });
    }
};

export const logoutController: RequestHandler = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    res.clearCookie('logged_in_user', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    sendResponse(res, 200, {
        success: true,
        message: 'Đăng xuất thành công',
        data: null,
    });
};

export const changePasswordController: RequestHandler = async (req, res) => {
    try {
        const token = req.cookies['access_token'];
        if (!token) throw new Error('Thiếu token trong request');

        const payload = verifyJWT(token as string);
        if (!payload) throw new Error('Token không hợp lệ');
        const userId = payload.id;

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) throw new Error('Thiếu mật khẩu cũ hoặc mới');

        await authService.changeUserPassword(Number(userId), oldPassword, newPassword);

        sendResponse(res, 200, {
            success: true,
            message: 'Đổi mật khẩu thành công',
            data: null,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 400, {
            success: false,
            message: 'Không thể đổi mật khẩu',
            error: errorMessage,
        });
    }
};

export const resetPasswordController: RequestHandler = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) throw new Error('Thiếu token hoặc mật khẩu mới');

        await authService.resetUserPassword(token, newPassword);

        sendResponse(res, 200, {
            success: true,
            message: 'Reset mật khẩu thành công',
            data: null,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        sendResponse(res, 400, {
            success: false,
            message: 'Không thể reset mật khẩu',
            error: errorMessage,
        });
    }
};
