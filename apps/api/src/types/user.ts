export interface CreatedUserInput {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: 'admin' | 'teacher';
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: 'admin' | 'teacher';
}
