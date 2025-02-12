// stores/auth.ts
import { defineStore } from 'pinia';
import { useAuthApi } from '~/services/api/authApi';
import { useUserApi } from '~/services/api/userApi';
import type { AuthResponse, LoginCredentials, RegisterData } from '~/types/auth';
import type { User } from '~/types/user';
import { HttpError, HttpStatusCode } from '~/types/http';
import { StoreIds } from './index';

export interface AuthState {
    user: User | null;
    error: string | null;
    loading: boolean;
    initialized: boolean;
}

export const useAuthStore = defineStore(StoreIds.AUTH, {
    state: (): AuthState => ({
        user: null,
        error: null,
        loading: false,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: (state) => state.user?.role === 'admin',
        userProfile: (state) => state.user,
    },

    actions: {
        handleError(e: unknown) {
            if (e instanceof HttpError) {
                this.error = e.message;
                const router = useRouter();

                switch (e.statusCode) {
                    case HttpStatusCode.UNAUTHORIZED:
                        this.user = null;
                        router.push('/login');
                        break;
                    case HttpStatusCode.FORBIDDEN:
                        router.push('/unauthorized');
                        break;
                }
            } else {
                this.error = e instanceof Error ? e.message : 'An unexpected error occurred';
            }
            return null;
        },

        async withLoading<T>(fn: () => Promise<T>): Promise<T | null> {
            this.error = null;
            this.loading = true;

            return fn()
                .catch((e) => this.handleError(e))
                .finally(() => {
                    this.loading = false;
                });
        },

        async initialize() {
            if (this.initialized) return;

            await this.withLoading(async () => {
                await this.fetchUser();
                this.initialized = true;
            });
        },

        async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
            return this.withLoading(async () => {
                const { execute } = useAuthApi().login();
                const response = await execute(credentials);

                if (response) {
                    await this.fetchUser();
                    // Redirect to intended destination or default route
                    const router = useRouter();
                    const redirect = router.currentRoute.value.query.redirect as string;
                    await router.push(redirect || '/dashboard');
                    return response;
                }
                return null;
            });
        },

        async register(data: RegisterData): Promise<AuthResponse | null> {
            return this.withLoading(async () => {
                const { execute } = useAuthApi().register();
                const response = await execute(data);

                if (response) {
                    await this.fetchUser();
                    const router = useRouter();
                    await router.push('/dashboard');
                    return response;
                }
                return null;
            });
        },

        async logout() {
            return this.withLoading(async () => {
                const { logout } = useAuthApi();
                logout();
                this.user = null;
                const router = useRouter();
                await router.push('/login');
                return null;
            });
        },

        async fetchUser() {
            const { getCurrentUser } = useUserApi();
            const { data } = await getCurrentUser();
            this.user = data.value;
        },

        updateUser(userData: Partial<User>) {
            if (this.user) {
                this.user = { ...this.user, ...userData };
            }
        },

        clearError() {
            this.error = null;
        },

        requireAuth() {
            const route = useRoute();
            const router = useRouter();

            // Setup navigation guard
            if (!this.isAuthenticated) {
                router.push(`/login?redirect=${route.fullPath}`);
            }

            // Watch for auth state changes
            watch(
                () => this.isAuthenticated,
                (authenticated) => {
                    if (!authenticated) {
                        router.push(`/login?redirect=${route.fullPath}`);
                    }
                }
            );
        },
    },
});
