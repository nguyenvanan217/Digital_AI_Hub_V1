import { CreatedTypeInput, UpdateTypeInput } from '../types/type';
import slugify from 'slugify';

const createType = async (data: CreatedTypeInput) => {
    if (!data.name) {
        throw new Error('Thiếu tên loại (name)');
    }

    const [newType] = await db.insert(types).values({
        name: data.name,
        description: data.description || null,
        slug: slugify(data.name, {
            lower: true,
            strict: true,
            locale: 'vi',
        }),
    });

    const createdType = await db.query.types.findFirst({
        where: eq(types.id, newType.insertId),
    });

    if (!createdType) throw new Error('Tạo loại thất bại');

    return createdType;
};

export const getTypes = async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) => {
    const offset = (page - 1) * pageSize;

    const [data, [{ total }]] = await Promise.all([
        db.query.types.findMany({
            orderBy: (types, { desc }) => [desc(types.createdAt)],
            limit: pageSize,
            offset,
        }),
        db.select({ total: sql<number>`count(*)` }).from(types),
    ]);

    return {
        types: data,
        total,
    };
};

const deleteType = async (id: number) => {
    const existingType = await db.query.types.findFirst({
        where: eq(types.id, id),
    });

    if (!existingType) {
        throw new Error('Loại không tồn tại');
    }

    await db.delete(types).where(eq(types.id, id));
    return existingType;
};

const updateType = async (id: number, data: UpdateTypeInput) => {
    const existingType = await db.query.types.findFirst({
        where: eq(types.id, id),
    });

    if (!existingType) {
        throw new Error('Loại không tồn tại');
    }

    await db
        .update(types)
        .set({
            name: data.name || existingType.name,
            description: data.description ?? existingType.description,
        })
        .where(eq(types.id, id));

    const updatedType = await db.query.types.findFirst({
        where: eq(types.id, id),
    });

    return updatedType;
};

export default {
    createType,
    getTypes,
    deleteType,
    updateType,
};
