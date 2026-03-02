import { RegisterInput, RegisterResponse, LoginInput, LoginResponse } from '../types/auth';
import { hashPassword } from '../utils/auth';
import { omit } from 'lodash';
import { comparePasswords } from '../utils/auth';
import { createJWT, JwtPayload, verifyJWT } from 'src/middleware/jwtAction';

const register = async (data: RegisterInput): Promise<RegisterResponse> => {
    // Validate required fields
    if (!data.email || !data.password || !data.name || !data.phone) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    // Check if email exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
    });

    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const [result] = await db.insert(users).values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: 'teacher',
    });

    const newUser = await db.query.users.findFirst({
        where: eq(users.id, result.insertId),
    });

    if (!newUser) {
        throw new Error('Đăng ký thất bại');
    }

    // Remove password hash from response
    return omit(newUser, ['password']) as RegisterResponse;
};
const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
    if (!data.username || !data.password) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
    }

    // Find user by email using Drizzle query
    const user = await db.query.users.findFirst({
        where: or(eq(users.email, data.username), eq(users.phone, data.username)),
    });

    if (!user) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác');
    }

    // Compare password with hashed password
    const isPasswordValid = await comparePasswords(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác');
    }

    // Create JWT payload
    const tokenPayload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    // Generate token
    const token = createJWT(tokenPayload);
    if (!token) {
        throw new Error('Không thể tạo token cho người dùng');
    }

    return {
        ...omit(user, ['password']),
        token,
    };
};
export const changeUserPassword = async (userId: number, oldPassword: string, newPassword: string) => {
    // Find user using Drizzle query
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }

    // Verify old password
    const isPasswordValid = await comparePasswords(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu cũ không đúng');
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password using Drizzle
    await db.update(users).set({ password: hashedNewPassword }).where(eq(users.id, userId));

    return {
        success: true,
        message: 'Thay đổi mật khẩu thành công',
    };
};

export const resetUserPassword = async (token: string, newPassword: string) => {
    const payload = verifyJWT(token);

    if (!payload || typeof payload.email !== 'string') {
        throw new Error('Đường dẫn không hợp lệ hoặc đã hết hạn');
    }

    const email = payload.email;

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length) {
        throw new Error('Không tìm thấy người dùng');
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));
};

export default {
    register,
    loginUser,
    changeUserPassword,
    resetUserPassword,
};
