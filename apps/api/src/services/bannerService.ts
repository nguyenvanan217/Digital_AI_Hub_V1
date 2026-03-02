import { CreatedBannerInput, UpdateBannerInput } from '../types/banner';
const createBanner = async (data: CreatedBannerInput) => {
    if (!data.imageUrl) {
        throw new Error('Thiếu thông tin bắt buộc');
    }

    const [newBanner] = await db.insert(banners).values({
        imageUrl: data.imageUrl,
    });

    const createdBanner = await db.query.banners.findFirst({
        where: eq(banners.id, newBanner.insertId),
    });

    if (!createdBanner) throw new Error('Tạo banner thất bại');

    return createdBanner;
};

export const getBanners = async ({
    page = 1,
    pageSize = 10,
}: {
    page?: number;
    pageSize?: number;
}) => {
    const offset = (page - 1) * pageSize;

    const [data, [{ total }]] = await Promise.all([
        db.query.banners.findMany({
            orderBy: (banners, { desc }) => [desc(banners.createdAt)],
            limit: pageSize,
            offset,
        }),
        db
            .select({ total: sql<number>`count(*)` })
            .from(banners)
    ]);

    return {
        banners: data,
        total,
    };
};

const deleteBanner = async (id: number) => {
    const existingBanner = await db.query.banners.findFirst({
        where: eq(banners.id, id),
    });

    if (!existingBanner) {
        throw new Error('Banner không tồn tại');
    }

    await db.delete(banners).where(eq(banners.id, id));
    return existingBanner;
};

const updateBanner = async (id: number, data: UpdateBannerInput) => {
    const existingBanner = await db.query.banners.findFirst({
        where: eq(banners.id, id),
    });

    if (!existingBanner) {
        throw new Error('Banner không tồn tại');
    }

    await db
        .update(banners)
        .set({
            imageUrl: data.imageUrl || existingBanner.imageUrl,
        })
        .where(eq(banners.id, id));

    const updatedBanner = await db.query.banners.findFirst({
        where: eq(banners.id, id),
    });

    return updatedBanner;
};

export default {
    createBanner,
    getBanners,
    deleteBanner,
    updateBanner,
};
