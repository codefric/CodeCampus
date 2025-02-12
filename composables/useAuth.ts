import { useAuthApi } from '~/services/api/authApi';
import { useUserApi } from '~/services/api/userApi';
import type { AuthResponse, LoginCredentials, RegisterData } from '~/types/auth';
import { HttpError, HttpStatusCode } from '~/types/http';
import type { User } from '~/types/user';

interface AuthState {
    user: User | null;
    error: string | null;
    loading: boolean;
}

export function useAuth() {
    const { login: loginApi, register: registerApi, logout: logoutApi } = useAuthApi();
    const { getCurrentUser } = useUserApi();
    const router = useRouter();
    const nuxtApp = useNuxtApp();

    // Centralized state management
    const state = useState<AuthState>('auth-state', () => ({
        user: null,
        error: null,
        loading: false,
    }));

    const isAuthenticated = computed(() => !!state.value.user);

    // Get current user data with proper error handling
    const { data: currentUser, refresh: refreshUser, error: userError } = getCurrentUser();

    // Watch for user data changes
    watch(currentUser, (newUser) => {
        if (newUser) {
            state.value.user = newUser;
        }
    });

    // Watch for user error to clear state if needed
    watch(userError, (error) => {
        if (error?.statusCode === HttpStatusCode.UNAUTHORIZED) {
            state.value.user = null;
        }
    });

    // Error handling helper with proper type checking
    function handleError(e: unknown) {
        if (e instanceof HttpError) {
            state.value.error = e.message;

            // Handle specific error cases
            switch (e.statusCode) {
                case HttpStatusCode.UNAUTHORIZED:
                    state.value.user = null;
                    router.push('/login');
                    break;
                case HttpStatusCode.FORBIDDEN:
                    router.push('/unauthorized');
                    break;
            }
        } else {
            state.value.error = e instanceof Error ? e.message : 'An unexpected error occurred';
        }
        return null;
    }

    // Set loading state with cleanup
    function withLoading<T>(fn: () => Promise<T>): Promise<T | null> {
        state.value.error = null;
        state.value.loading = true;

        return fn()
            .catch(handleError)
            .finally(() => {
                state.value.loading = false;
            });
    }

    // Login
    async function login(credentials: LoginCredentials): Promise<AuthResponse | null> {
        return withLoading(async () => {
            const { execute } = loginApi();
            const response = await execute(credentials);

            if (response) {
                await refreshUser();
                // Redirect to intended destination or default route
                const redirect = router.currentRoute.value.query.redirect as string;
                await router.push(redirect || '/dashboard');
                return response;
            }
            return null;
        });
    }

    // Register
    async function register(data: RegisterData): Promise<AuthResponse | null> {
        return withLoading(async () => {
            const { execute } = registerApi();
            const response = await execute(data);

            if (response) {
                await refreshUser();
                await router.push('/dashboard');
                return response;
            }
            return null;
        });
    }

    // Logout
    async function logout() {
        return withLoading(async () => {
            logoutApi();
            state.value.user = null;
            await router.push('/login');
            return null;
        });
    }

    // Initialize auth state
    async function init() {
        return withLoading(async () => {
            await refreshUser();
            return state.value.user;
        });
    }

    // Route navigation guard helper that can be used in middleware or setup
    function requireAuth() {
        const route = useRoute();
        const redirectToLogin = () => {
            if (!isAuthenticated.value) {
                router.push(`/login?redirect=${route.fullPath}`);
            }
        };

        if (import.meta.client) {
            // Run immediately on client
            redirectToLogin();
            // Watch for auth state changes
            watch(isAuthenticated, (authenticated) => {
                if (!authenticated) {
                    redirectToLogin();
                }
            });
        }
    }

    // Initialize on app creation
    if (import.meta.client) {
        // Use nuxt app hooks for initialization
        nuxtApp.hooks.hook('app:mounted', () => {
            init();
        });
    }

    return {
        // State
        user: computed(() => state.value.user),
        error: computed(() => state.value.error),
        loading: computed(() => state.value.loading),
        isAuthenticated,

        // Actions
        login,
        register,
        logout,
        refresh: refreshUser,

        // Helpers
        init,
        requireAuth,
    };
}
