export type CreatedTopicInput = {
    name: string;
    description?: string;
    typeId: number;
    createdBy: number;
};

export interface UpdateTopicInput {
    name?: string;
    description?: string;
    typeId?: number;
}
