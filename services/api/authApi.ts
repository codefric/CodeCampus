import { useHttp } from '~/composables/api/useHttpMethods';
import type { AuthResponse, LoginCredentials, RegisterData } from '~/types/auth';
import { HttpStatusCode } from '~/types/http';

export function useAuthApi() {
    const config = useRuntimeConfig();
    const { usePost } = useHttp(config.public.apiBase as string);
    const token = useCookie('token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'strict',
    });

    const login = (credentials?: LoginCredentials) => {
        const { execute, ...rest } = usePost<AuthResponse, LoginCredentials>('/auth/login', credentials, {
            errorMessages: {
                [HttpStatusCode.UNAUTHORIZED]: 'Invalid email or password',
                [HttpStatusCode.TOO_MANY_REQUESTS]: 'Too many login attempts, please try again later',
            },
        });

        async function executeLogin(newCredentials?: LoginCredentials) {
            try {
                const response = await execute(newCredentials);

                if (response?.token) {
                    token.value = response.token;
                    // You might want to trigger other actions on successful login
                    // e.g., update user state, fetch profile, etc.
                } else {
                    throw new Error('Invalid response: Missing token');
                }

                return response;
            } catch (error) {
                // Clear token on error just in case
                token.value = null;
                throw error;
            }
        }

        return {
            ...rest,
            execute: executeLogin,
        };
    };

    const register = (data?: RegisterData) => {
        const { execute, ...rest } = usePost<AuthResponse, RegisterData>('/auth/register', data, {
            errorMessages: {
                [HttpStatusCode.CONFLICT]: 'An account with this email already exists',
                [HttpStatusCode.UNPROCESSABLE_ENTITY]: 'Invalid registration data',
            },
        });

        async function executeRegister(newData?: RegisterData) {
            try {
                const response = await execute(newData);

                if (response?.token) {
                    token.value = response.token;
                    // You might want to trigger other actions on successful registration
                    // e.g., update user state, send welcome email, etc.
                } else {
                    throw new Error('Invalid response: Missing token');
                }

                return response;
            } catch (error) {
                // Clear token on error just in case
                token.value = null;
                throw error;
            }
        }

        return {
            ...rest,
            execute: executeRegister,
        };
    };

    const logout = () => {
        try {
            // Clear token
            token.value = null;

            // Additional cleanup actions you might want to perform:
            // - Clear user state
            // - Clear cached data
            // - Reset store state
            // - Redirect to login page

            const router = useRouter();
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if other cleanup fails, ensure token is cleared
            token.value = null;
        }
    };

    // Helper to check if user is authenticated
    const isAuthenticated = computed(() => !!token.value);

    return {
        login,
        register,
        logout,
        isAuthenticated,
    };
}
