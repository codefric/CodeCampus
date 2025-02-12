export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    role: 'admin' | 'others';
}

export interface UpdateUserData {
    email?: string;
    name?: string;
    password?: string;
}
