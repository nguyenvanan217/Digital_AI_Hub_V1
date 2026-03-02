export type CreatedResourceInput = {
    title: string;
    topicId: number;
    link?: string;
    description?: string;
    content?: string;
    periodType: 'week' | 'month' | 'quarter';
    coverImage?: string;
    createdBy: number;
    visibility?: 'public' | 'private';
    status: 'active' | 'inactive';
};

export interface UpdateResourceInput {
    title?: string;
    topicId?: number;
    link?: string;
    description?: string;
    content?: string;
    coverImage?: string;
    periodType?: 'week' | 'month' | 'quarter';
    visibility?: 'public' | 'private';
    status?: 'active' | 'inactive';
}
