export interface RegisterInput {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: 'admin' | 'teacher';
}

export interface RegisterResponse {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'teacher' | 'admin';
    createdAt: Date;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: 'teacher' | 'admin';
    token: string;
}
