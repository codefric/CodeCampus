import { useHttp } from '~/composables/api/useHttpMethods';
import { HttpStatusCode } from '~/types/http';
import type { UpdateUserData, User } from '~/types/user';

export function useUserApi() {
    const config = useRuntimeConfig();
    const { useGet, usePut, useDelete } = useHttp(config.public.apiBase as string);

    const getCurrentUser = () =>
        useGet<User>('/users/me', {
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Please login to access your profile',
                [HttpStatusCode.NOT_FOUND]: 'User profile not found',
            },
            watch: [useCookie('token')], // Automatically refetch when token changes
        });

    const updateProfile = (defaultData?: UpdateUserData) =>
        usePut<User, UpdateUserData>('/users/me', defaultData, {
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Please login to update your profile',
                [HttpStatusCode.UNPROCESSABLE_ENTITY]: 'Invalid profile data provided',
                [HttpStatusCode.CONFLICT]: 'This email is already in use',
            },
        });

    const deleteAccount = () =>
        useDelete<void>('/users/me', {
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Please login to delete your account',
                [HttpStatusCode.FORBIDDEN]: 'You do not have permission to delete this account',
            },
        });

    const getUsers = (options?: { query?: Record<string, string> }) =>
        useGet<User[]>('/users', {
            ...options,
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Please login to view users',
                [HttpStatusCode.FORBIDDEN]: 'You do not have permission to view users',
            },
        });

    const getUserById = (id: number) =>
        useGet<User>(`/users/${id}`, {
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Please login to view user details',
                [HttpStatusCode.NOT_FOUND]: 'User not found',
                [HttpStatusCode.FORBIDDEN]: 'You do not have permission to view this user',
            },
        });

    // Helper composable to handle common user operations
    const useUser = () => {
        const { data: currentUser, status: isLoading, error } = getCurrentUser();

        const isAdmin = computed(() => currentUser.value?.role === 'admin');

        // Refresh user data
        const refreshUser = async () => {
            await getCurrentUser().execute();
        };

        // Update user with error handling
        const updateUser = async (data: UpdateUserData) => {
            const { execute } = updateProfile(data);
            await execute();
            // Refresh user data after update
            await refreshUser();
        };

        // Delete account with confirmation
        const deleteUser = async () => {
            const { execute } = deleteAccount();
            await execute();
            // Clear auth token and redirect
            const token = useCookie('token');
            token.value = null;
            const router = useRouter();
            router.push('/login');
        };

        return {
            user: currentUser,
            isLoading,
            error,
            isAdmin,
            refreshUser,
            updateUser,
            deleteUser,
        };
    };

    return {
        getCurrentUser,
        updateProfile,
        deleteAccount,
        getUsers,
        getUserById,
        useUser, // Expose the helper composable
    };
}
