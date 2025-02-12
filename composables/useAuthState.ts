import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useUIStore } from '~/store/ui';
import type { LoginCredentials } from '~/types/auth';

export function useAuthState() {
    const authStore = useAuthStore();
    const uiStore = useUIStore();

    // Use storeToRefs for reactive state
    const { user, loading, error } = storeToRefs(authStore);

    // Login with error handling
    async function login(credentials: LoginCredentials) {
        try {
            const response = await authStore.login(credentials);
            if (response) {
                uiStore.showNotification({
                    type: 'success',
                    message: 'Successfully logged in!',
                });
                return true;
            }
            return false;
        } catch (error) {
            uiStore.showNotification({
                type: 'error',
                message: error instanceof Error ? error.message : 'Login failed',
            });
            return false;
        }
    }

    // Logout with confirmation
    async function logout() {
        try {
            await authStore.logout();
            uiStore.showNotification({
                type: 'success',
                message: 'Successfully logged out',
            });
        } catch (error) {
            uiStore.showNotification({
                type: 'error',
                message: 'Failed to logout',
            });
        }
    }

    return {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        isAdmin: computed(() => authStore.isAdmin),
    };
}
