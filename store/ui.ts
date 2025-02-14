// stores/ui.ts
import { defineStore } from 'pinia';
import { StoreIds } from './index';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
export type DrawerPlacement = 'left' | 'right';

interface DrawerState {
    isOpen: boolean;
    size: DrawerSize;
    placement: DrawerPlacement;
}

interface BannerState {
    isVisible: boolean;
    isCollapsed: boolean;
}

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
    drawers: Record<string, DrawerState>;
    banners: Record<string, BannerState>;
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
        drawers: {},
        banners: {},
    }),

    getters: {
        isDarkMode: (state) => state.theme === 'dark',

        activeNotifications: (state) => state.notifications,

        isModalOpen: (state) => {
            return (modalId: string) => state.modals[modalId] ?? false;
        },

        isDrawerOpen: (state) => {
            return (drawerId: string) => state.drawers[drawerId]?.isOpen ?? false;
        },

        getDrawerState: (state) => {
            return (drawerId: string) => state.drawers[drawerId];
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

        registerDrawer(
            drawerId: string,
            options: {
                size?: DrawerSize;
                placement?: DrawerPlacement;
            } = {}
        ) {
            this.drawers[drawerId] = {
                isOpen: false,
                size: options.size ?? 'md',
                placement: options.placement ?? 'right',
            };
        },

        unregisterDrawer(drawerId: string) {
            delete this.drawers[drawerId];
        },

        openDrawer(drawerId: string) {
            if (this.drawers[drawerId]) {
                this.drawers[drawerId].isOpen = true;
            }
        },

        closeDrawer(drawerId: string) {
            if (this.drawers[drawerId]) {
                this.drawers[drawerId].isOpen = false;
            }
        },

        toggleDrawer(drawerId: string) {
            if (this.drawers[drawerId]) {
                this.drawers[drawerId].isOpen = !this.drawers[drawerId].isOpen;
            }
        },

        updateDrawerSize(drawerId: string, size: DrawerSize) {
            if (this.drawers[drawerId]) {
                this.drawers[drawerId].size = size;
            }
        },

        updateDrawerPlacement(drawerId: string, placement: DrawerPlacement) {
            if (this.drawers[drawerId]) {
                this.drawers[drawerId].placement = placement;
            }
        },
        registerBanner(bannerId: string) {
            if (!this.banners[bannerId]) {
                this.banners[bannerId] = {
                    isVisible: true,
                    isCollapsed: false,
                };
            }
        },

        unregisterBanner(bannerId: string) {
            delete this.banners[bannerId];
        },

        toggleBannerCollapse(bannerId: string) {
            if (this.banners[bannerId]) {
                this.banners[bannerId].isCollapsed = !this.banners[bannerId].isCollapsed;
            }
        },

        hideBanner(bannerId: string) {
            if (this.banners[bannerId]) {
                this.banners[bannerId].isVisible = false;
            }
        },

        showBanner(bannerId: string) {
            if (this.banners[bannerId]) {
                this.banners[bannerId].isVisible = true;
            }
        },
    },
});
