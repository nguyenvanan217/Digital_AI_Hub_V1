import { CreatedResourceInput, UpdateResourceInput } from '../types/resource';
import slugify from 'slugify';
import { JwtPayload } from 'src/middleware/jwtAction';

const createResource = async ({ data, userVerify }: { data: CreatedResourceInput; userVerify: JwtPayload | null }) => {
    const userRole = userVerify?.role;
    if (!userRole) {
        throw new Error('Unauthorized');
    }

    console.log(userRole);

    if (!data.title || !data.topicId || !data.periodType || !data.createdBy) {
        throw new Error('Thiếu thông tin bắt buộc');
    }

    const existingResource = await db.query.resources.findFirst({
        where: eq(resources.title, data.title),
    });

    if (existingResource) {
        throw new Error(`Title "${data.title}" đã tồn tại`);
    }

    const [newResource] = await db.insert(resources).values({
        title: data.title,
        topicId: data.topicId,
        link: data.link,
        description: data.description,
        content: data.content,
        periodType: data.periodType,
        createdBy: data.createdBy,
        coverImage: data.coverImage ?? null,
        visibility: data.visibility ?? 'public',
        slug: slugify(data.title, {
            lower: true,
            strict: true,
            locale: 'vi',
        }),
        status: userRole === 'admin' ? 'active' : 'inactive',
    });

    const createdResource = await db.query.resources.findFirst({
        where: eq(resources.id, newResource.insertId),
    });

    if (!createdResource) throw new Error('Tạo tài nguyên thất bại');

    return createdResource;
};

export const getResources = async ({
    page = 1,
    pageSize = 10,
    search,
    topicId,
    topicSlug,
    status,
}: {
    page?: number;
    pageSize?: number;
    search?: string;
    topicId?: string;
    topicSlug?: string;
    status?: 'active' | 'inactive';
}) => {
    const offset = (page - 1) * pageSize;

    const whereConditions = [];

    if (search) whereConditions.push(sql`${resources.title} LIKE ${'%' + search + '%'}`);
    if (topicId) whereConditions.push(eq(resources.topicId, Number(topicId)));

    if (topicSlug) {
        whereConditions.push(eq(topics.slug, topicSlug));
    }

    if (status) {
        whereConditions.push(eq(resources.status, status));
    }

    const finalWhere =
        whereConditions.length === 0
            ? undefined
            : whereConditions.length === 1
                ? whereConditions[0]
                : and(...whereConditions);

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: resources.id,
                title: resources.title,
                slug: resources.slug,
                topicId: resources.topicId,
                link: resources.link,
                description: resources.description,
                content: resources.content,
                visibility: resources.visibility,
                coverImage: resources.coverImage,
                periodType: resources.periodType,
                type: resources.periodType, // Add type field for frontend
                createdBy: resources.createdBy,
                createdAt: resources.createdAt,
                updatedAt: resources.updatedAt,
                // Joined data
                createdByName: users.name,
                topicName: topics.name,
                status: resources.status,
            })
            .from(resources)
            .leftJoin(users, eq(resources.createdBy, users.id))
            .leftJoin(topics, eq(resources.topicId, topics.id))
            .where(finalWhere)
            .orderBy(sql`${resources.createdAt} DESC`)
            .limit(pageSize)
            .offset(offset),
        db
            .select({ total: sql<number>`count(*)` })
            .from(resources)
            .where(finalWhere),
    ]);

    return {
        resources: data,
        total,
    };
};

export const getMyResources = async ({
    page = 1,
    pageSize = 10,
    search,
    topicId,
    userVerify,
    status,
}: {
    page?: number;
    pageSize?: number;
    search?: string;
    topicId?: string;
    typeId?: string;
    userVerify: JwtPayload | null;
    status?: 'active' | 'inactive';
}) => {
    const offset = (page - 1) * pageSize;
    const userId = userVerify?.id;
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const whereConditions = [];

    if (search) whereConditions.push(sql`${resources.title} LIKE ${'%' + search + '%'}`);
    if (topicId) whereConditions.push(eq(resources.topicId, Number(topicId)));
    if (status) {
        whereConditions.push(eq(resources.status, status));
    }

    whereConditions.push(eq(resources.createdBy, userId));

    const finalWhere =
        whereConditions.length === 0
            ? undefined
            : whereConditions.length === 1
                ? whereConditions[0]
                : and(...whereConditions);

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: resources.id,
                title: resources.title,
                slug: resources.slug,
                topicId: resources.topicId,
                link: resources.link,
                description: resources.description,
                content: resources.content,
                visibility: resources.visibility,
                coverImage: resources.coverImage,
                periodType: resources.periodType,
                createdBy: resources.createdBy,
                createdAt: resources.createdAt,
                updatedAt: resources.updatedAt,
                createdByName: users.name,
                topicName: topics.name,
                status: resources.status,
            })
            .from(resources)
            .leftJoin(users, eq(resources.createdBy, users.id))
            .leftJoin(topics, eq(resources.topicId, topics.id))
            .where(finalWhere)
            .orderBy(sql`${resources.createdAt} DESC`)
            .limit(pageSize)
            .offset(offset),
        db
            .select({ total: sql<number>`count(*)` })
            .from(resources)
            .where(finalWhere),
    ]);

    return {
        resources: data,
        total,
    };
};

const deleteResource = async (id: number, userVerify: JwtPayload | null) => {
    const existingResource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    });

    if (!existingResource) {
        throw new Error('Tài nguyên không tồn tại');
    }

    const userId = userVerify?.id;
    const userRole = userVerify?.role;
    if (userRole !== 'admin' && existingResource.createdBy !== userId) {
        throw new Error('Không có quyền xoá bài đăng của người khác');
    }

    await db.delete(resources).where(eq(resources.id, id));
    return existingResource;
};

const updateResource = async (id: number, data: UpdateResourceInput, userVerify: JwtPayload | null) => {
    const existingResource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    });

    if (!existingResource) {
        throw new Error('Tài nguyên không tồn tại');
    }

    const userId = userVerify?.id;
    const userRole = userVerify?.role;
    if (userRole !== 'admin' && existingResource.createdBy !== userId) {
        throw new Error('Không có quyền cập nhật');
    }

    await db
        .update(resources)
        .set({
            title: data.title ?? existingResource.title,
            topicId: data.topicId ?? existingResource.topicId,
            link: data.link ?? existingResource.link,
            description: data.description ?? existingResource.description,
            content: data.content ?? existingResource.content,
            periodType: data.periodType ?? existingResource.periodType,
            coverImage: data.coverImage ?? null,
            slug: data.title
                ? slugify(data.title, {
                    lower: true,
                    strict: true,
                    locale: 'vi',
                })
                : existingResource.slug,
            visibility: data.visibility ?? existingResource.visibility,
        })
        .where(eq(resources.id, id));

    const updatedResource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    });

    return updatedResource;
};

export const getResourceBySlug = async (slug: string) => {
    const resource = await db
        .select({
            id: resources.id,
            title: resources.title,
            slug: resources.slug,
            topicId: resources.topicId,
            link: resources.link,
            description: resources.description,
            content: resources.content,
            visibility: resources.visibility,
            coverImage: resources.coverImage,
            periodType: resources.periodType,
            createdBy: resources.createdBy,
            createdAt: resources.createdAt,
            updatedAt: resources.updatedAt,
            // Joined data
            createdByName: users.name,
            topicName: topics.name,
            status: resources.status,
        })
        .from(resources)
        .leftJoin(users, eq(resources.createdBy, users.id))
        .leftJoin(topics, eq(resources.topicId, topics.id))
        .where(eq(resources.slug, slug))
        .limit(1);

    if (!resource || resource.length === 0) {
        throw new Error('Resource không tồn tại');
    }

    return resource[0];
};

const approveResource = async (id: number) => {
    const existingResource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    });
    if (!existingResource) {
        throw new Error('Tài nguyên không tồn tại');
    }
    await db

        .update(resources)
        .set({
            status: 'active',
        })
        .where(eq(resources.id, id));
    const updatedResource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
    });
    return updatedResource;
};

export default {
    createResource,
    getResources,
    getResourceBySlug,
    deleteResource,
    updateResource,
    getMyResources,
    approveResource,
};
