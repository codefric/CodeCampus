// stores/ui.ts
import { defineStore } from 'pinia';
import { StoreIds } from './index';

export interface UIState {
    theme: 'light' | 'dark';
    sidebar: {
        isOpen: boolean;
        width: number;
    };
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        timeout?: number;
    }>;
    modals: Record<string, boolean>;
}

export const useUIStore = defineStore(StoreIds.UI, {
    state: (): UIState => ({
        theme: 'light',
        sidebar: {
            isOpen: true,
            width: 256,
        },
        notifications: [],
        modals: {},
    }),


    getters: {
        isDarkMode: (state) => state.theme === 'dark',

        activeNotifications: (state) => state.notifications,

        isModalOpen: (state) => {
            return (modalId: string) => state.modals[modalId] ?? false;
        },
    },

    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            // Update HTML class for tailwind dark mode
            document.documentElement.classList.toggle('dark', this.theme === 'dark');
        },

        toggleSidebar() {
            this.sidebar.isOpen = !this.sidebar.isOpen;
        },

        setSidebarWidth(width: number) {
            this.sidebar.width = width;
        },

        showNotification({
            type,
            message,
            timeout = 5000,
        }: {
            type: UIState['notifications'][number]['type'];
            message: string;
            timeout?: number;
        }) {
            const id = Date.now().toString();

            this.notifications.push({
                id,
                type,
                message,
                timeout,
            });

            if (timeout > 0) {
                setTimeout(() => {
                    this.removeNotification(id);
                }, timeout);
            }

            return id;
        },

        removeNotification(id: string) {
            const index = this.notifications.findIndex((n) => n.id === id);
            if (index !== -1) {
                this.notifications.splice(index, 1);
            }
        },

        clearNotifications() {
            this.notifications = [];
        },

        openModal(modalId: string) {
            this.modals[modalId] = true;
        },

        closeModal(modalId: string) {
            this.modals[modalId] = false;
        },

        toggleModal(modalId: string) {
            this.modals[modalId] = !this.modals[modalId];
        },
    },
});
