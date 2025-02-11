import { useHttp } from '~/composables/api/useHttpMethods';
import type { UpdateUserData, User } from '~/types/user';

export function useUserApi() {
    const config = useRuntimeConfig();
    const { useGet, usePut, useDelete } = useHttp(config.public.apiBase as string);

    const getCurrentUser = () => useGet<User>('/users/me');

    const updateProfile = (defaultData?: UpdateUserData) => usePut<User, UpdateUserData>('/users/me', defaultData);

    const deleteAccount = () => useDelete<void>('/users/me');

    const getUsers = (options?: { query?: Record<string, string> }) => useGet<User[]>('/users', options);

    const getUserById = (id: number) => useGet<User>(`/users/${id}`);

    return {
        getCurrentUser,
        updateProfile,
        deleteAccount,
        getUsers,
        getUserById,
    };
}
