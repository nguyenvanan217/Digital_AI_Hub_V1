import { CreatedTopicInput, UpdateTopicInput } from '../types/topic';
import slugify from 'slugify';

const createTopic = async (data: CreatedTopicInput) => {
    if (!data.name || !data.createdBy) {
        throw new Error('Thiếu thông tin bắt buộc');
    }

    const type = await db.query.types.findFirst({
        where: eq(types.id, data.typeId),
    });

    if (!type) throw new Error('Loại type không tồn tại');

    const topicSlug = slugify(data.name, {
        lower: true,
        strict: true,
        locale: 'vi',
    });

    const fullSlug = `/${type.slug}/${topicSlug}`;

    const [newTopic] = await db.insert(topics).values({
        name: data.name,
        description: data.description || null,
        slug: fullSlug,
        typeId: data.typeId,
        createdBy: data.createdBy,
    });

    const createdTopic = await db.query.topics.findFirst({
        where: eq(topics.id, newTopic.insertId),
    });

    if (!createdTopic) throw new Error('Tạo topic thất bại');

    return createdTopic;
};

export const getTopics = async ({
    page = 1,
    pageSize = 10,
    search,
    typeId,
}: {
    page?: number;
    pageSize?: number;
    search?: string;
    typeId?: string;
}) => {
    const offset = (page - 1) * pageSize;

    const whereConditions = [];

    if (search) whereConditions.push(sql`${topics.name} LIKE ${'%' + search + '%'}`);
    if (typeId) whereConditions.push(eq(topics.typeId, Number(typeId)));

    const finalWhere =
        whereConditions.length === 0
            ? undefined
            : whereConditions.length === 1
                ? whereConditions[0]
                : and(...whereConditions);

    const [data, [{ total }]] = await Promise.all([
        db
            .select({
                id: topics.id,
                name: topics.name,
                slug: topics.slug,
                description: topics.description,
                createdBy: topics.createdBy,
                createdAt: topics.createdAt,
                updatedAt: topics.updatedAt,
                createdByName: users.name,
                typeId: types.id,
                typeName: types.name,
            })
            .from(topics)
            .leftJoin(users, eq(topics.createdBy, users.id))
            .leftJoin(types, eq(topics.typeId, types.id))
            .where(finalWhere)
            .orderBy(sql`${topics.createdAt} DESC`)
            .limit(pageSize)
            .offset(offset),
        db
            .select({ total: sql<number>`count(*)` })
            .from(topics)
            .where(finalWhere),
        ,
    ]);
    return {
        topics: data,
        total,
    };
};

export const getTopicBySlug = async (slug: string) => {
    const topic = await db
        .select({
            id: topics.id,
            name: topics.name,
            slug: topics.slug,
            description: topics.description,
            createdBy: topics.createdBy,
            createdAt: topics.createdAt,
            updatedAt: topics.updatedAt,
            createdByName: users.name,
            typeId: types.id,
            typeName: types.name,
        })
        .from(topics)
        .leftJoin(users, eq(topics.createdBy, users.id))
        .leftJoin(types, eq(topics.typeId, types.id))
        .where(eq(topics.slug, slug))
        .limit(1);

    if (!topic.length) {
        throw new Error('Topic không tồn tại');
    }

    return topic[0];
};

const deleteTopic = async (id: number) => {
    const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, id),
    });

    if (!existingTopic) {
        throw new Error('Topic không tồn tại');
    }

    await db.delete(topics).where(eq(topics.id, id));
    return existingTopic;
};

const updateTopic = async (id: number, data: UpdateTopicInput) => {
    const existingTopic = await db.query.topics.findFirst({
        where: eq(topics.id, id),
    });

    if (!existingTopic) {
        throw new Error('Topic không tồn tại');
    }

    const newName = data.name || existingTopic.name;
    const newTypeId = data.typeId || existingTopic.typeId;

    const type = await db.query.types.findFirst({
        where: eq(types.id, newTypeId),
    });

    if (!type) throw new Error('Loại type không tồn tại');

    let newSlug = existingTopic.slug;
    if (data.name || data.typeId) {
        const topicSlug = slugify(newName, { lower: true, strict: true, locale: 'vi' });
        newSlug = `/${type.slug}/${topicSlug}`;
    }

    await db
        .update(topics)
        .set({
            name: data.name || existingTopic.name,
            description: data.description ?? existingTopic.description,
            typeId: data.typeId || existingTopic.typeId,
            slug: newSlug,
        })
        .where(eq(topics.id, id));

    const updatedTopic = await db.query.topics.findFirst({
        where: eq(topics.id, id),
    });

    return updatedTopic;
};

export default {
    createTopic,
    getTopics,
    getTopicBySlug,
    deleteTopic,
    updateTopic,
};
