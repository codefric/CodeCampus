import { useHttp } from '~/composables/api/useHttpMethods';
import type { AuthResponse, LoginCredentials, RegisterData } from '~/types/auth';

export function useAuthApi() {
    const config = useRuntimeConfig();
    const { usePost } = useHttp(config.public.apiBase as string);
    const token = useCookie('token');

    const login = (credentials?: LoginCredentials) => {
        const { execute, ...rest } = usePost<AuthResponse, LoginCredentials>('/auth/login', credentials);

        async function executeLogin(newCredentials?: LoginCredentials) {
            const response = await execute(newCredentials);
            if (response?.token) {
                token.value = response.token;
            }
            return response;
        }

        return {
            ...rest,
            execute: executeLogin,
        };
    };

    const register = (data?: RegisterData) => {
        const { execute, ...rest } = usePost<AuthResponse, RegisterData>('/auth/register', data);

        async function executeRegister(newData?: RegisterData) {
            const response = await execute(newData);
            if (response?.token) {
                token.value = response.token;
            }
            return response;
        }

        return {
            ...rest,
            execute: executeRegister,
        };
    };

    const logout = () => {
        token.value = null;
    };

    return {
        login,
        register,
        logout,
    };
}
