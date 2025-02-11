import { useAuthApi } from '~/services/api/authApi';
import { useUserApi } from '~/services/api/userApi';
import type { LoginCredentials, RegisterData } from '~/types/auth';
import type { User } from '~/types/user';

export function useAuth() {
    const { login: loginApi, register: registerApi, logout: logoutApi } = useAuthApi();
    const { getCurrentUser } = useUserApi();

    const user = useState<User | null>('auth-user', () => null);
    const isAuthenticated = computed(() => !!user.value);
    const error = ref<string | null>(null);
    const loading = ref(false);

    // Get current user data
    const { data: currentUser, refresh: refreshUser } = getCurrentUser();

    // Watch for user data changes
    watch(currentUser, (newUser) => {
        if (newUser) {
            user.value = newUser;
        }
    });

    // Error handling helper
    function handleError(e: unknown) {
        const err = e as Error;
        error.value = err.message || 'Something went wrong';
        return null;
    }

    // Login
    async function login(credentials: LoginCredentials) {
        error.value = null;
        loading.value = true;

        try {
            const { execute } = loginApi();
            const response = await execute(credentials);

            if (response) {
                await refreshUser();
                return response;
            }
            return null;
        } catch (e) {
            return handleError(e);
        } finally {
            loading.value = false;
        }
    }

    // Register
    async function register(data: RegisterData) {
        error.value = null;
        loading.value = true;

        try {
            const { execute } = registerApi();
            const response = await execute(data);

            if (response) {
                await refreshUser();
                return response;
            }
            return null;
        } catch (e) {
            return handleError(e);
        } finally {
            loading.value = false;
        }
    }

    // Logout
    async function logout() {
        error.value = null;
        loading.value = true;

        try {
            logoutApi();
            user.value = null;
        } catch (e) {
            handleError(e);
        } finally {
            loading.value = false;
        }
    }

    // Initialize auth state
    async function init() {
        error.value = null;
        loading.value = true;

        try {
            await refreshUser();
        } catch (e) {
            handleError(e);
        } finally {
            loading.value = false;
        }
    }

    // Auto-initialize on plugin creation
    onMounted(() => {
        init();
    });

    return {
        // State
        user,
        isAuthenticated,
        error,
        loading,

        // Actions
        login,
        register,
        logout,
        refresh: refreshUser,

        // Helpers
        init,
    };
}
