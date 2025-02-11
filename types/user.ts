export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserData {
    email?: string;
    name?: string;
    password?: string;
}
