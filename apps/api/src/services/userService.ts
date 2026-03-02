import { CreatedUserInput, UpdateUserInput } from '../types/user';
import { hashPassword } from 'src/utils/auth';

const createUser = async (data: CreatedUserInput) => {
    if (!data.name || !data.email || !data.password) {
        throw new Error('Thiếu thông tin bắt buộc');
    }

    // Kiểm tra email hoặc phone đã tồn tại chưa
    const whereConditions = [eq(users.email, data.email)];
    if (data.phone) {
        whereConditions.push(eq(users.phone, data.phone));
    }

    const existingUser = await db.query.users.findFirst({
        where: or(...whereConditions),
    });

    if (existingUser) {
        if (existingUser.email === data.email) {
            throw new Error('Email đã được sử dụng');
        }
        if (data.phone && existingUser.phone === data.phone) {
            throw new Error('Số điện thoại đã được sử dụng');
        }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const [newUser] = await db.insert(users).values({
        name: data.name,
        phone: data.phone || null,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? 'teacher',
    });

    const createdUser = await db.query.users.findFirst({
        where: eq(users.id, newUser.insertId),
    });

    if (!createdUser) throw new Error('Tạo người dùng thất bại');

    return createdUser;
};

export const getUsers = async ({
    page = 1,
    pageSize = 10,
    search,
}: {
    page?: number;
    pageSize?: number;
    search?: string;
}) => {
    const offset = (page - 1) * pageSize;

    const whereCondition = search ? sql`${users.name} LIKE ${'%' + search + '%'}` : undefined;

    const [data, [{ total }]] = await Promise.all([
        db.query.users.findMany({
            orderBy: (users, { desc }) => [desc(users.createdAt)],
            limit: pageSize,
            offset,
            where: whereCondition,
        }),
        db
            .select({ total: sql<number>`count(*)` })
            .from(users)
            .where(whereCondition),
    ]);

    return {
        users: data,
        total,
    };
};
const deleteUser = async (id: number) => {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!existingUser) {
        throw new Error('Người dùng không tồn tại');
    }

    await db.delete(users).where(eq(users.id, id));
    return existingUser;
};

const updateUser = async (id: number, data: UpdateUserInput) => {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!existingUser) {
        throw new Error('Người dùng không tồn tại');
    }

    const conflictUser = await db.query.users.findFirst({
        where: and(sql`${users.id} != ${id}`, or(eq(users.email, data.email ?? ''), eq(users.phone, data.phone ?? ''))),
    });

    if (conflictUser) {
        if (conflictUser.email === data.email) {
            throw new Error('Email đã được sử dụng');
        }
        if (data.phone && conflictUser.phone === data.phone) {
            throw new Error('Số điện thoại đã được sử dụng');
        }
    }

    const passwordHash = data.password ? await hashPassword(data.password) : existingUser.password;

    await db
        .update(users)
        .set({
            name: data.name ?? existingUser.name,
            phone: data.phone ?? existingUser.phone,
            email: data.email ?? existingUser.email,
            password: passwordHash,
            role: data.role ?? existingUser.role,
        })
        .where(eq(users.id, id));

    const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    return updatedUser;
};

export default {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
};
