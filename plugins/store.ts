// plugins/store.ts
import { defineNuxtPlugin } from '#app';
import { useAppStore } from '~/store';
import { useAuthStore } from '~/store/auth';
import { useUIStore } from '~/store/ui';

export default defineNuxtPlugin(async () => {
    // Initialize stores in the correct order
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const uiStore = useUIStore();

    try {
        // Initialize app store first
        await appStore.initialize();

        // Initialize auth store if not in maintenance mode
        if (!appStore.isMaintenanceMode) {
            await authStore.initialize();
        }

        // Set initial theme
        if (process.client) {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark && uiStore.theme === 'light') {
                uiStore.toggleTheme();
            }
        }
    } catch (error) {
        console.error('Failed to initialize stores:', error);
        // Handle initialization error (e.g., show error page)
    }
});
