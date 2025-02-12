// stores/index.ts
import { defineStore } from 'pinia';

// Define store IDs as constants to avoid magic strings
export const StoreIds = {
    APP: 'app',
    AUTH: 'auth',
    USER: 'user',
    UI: 'ui',
} as const;

// Define interfaces for each store state
export interface AppState {
    initialized: boolean;
    version: string;
    config: {
        maintenanceMode: boolean;
        features: Record<string, boolean>;
    };
}

// Core app store for application-wide state
export const useAppStore = defineStore(StoreIds.APP, {
    // SSR hydration needs to be considered in state initialization
    state: (): AppState => ({
        initialized: false,
        version: '1.0.0',
        config: {
            maintenanceMode: false,
            features: {},
        },
    }),

    getters: {
        isFeatureEnabled: (state) => {
            return (featureKey: string) => state.config.features[featureKey] ?? false;
        },

        isMaintenanceMode: (state) => state.config.maintenanceMode,
    },

    actions: {
        async initialize() {
            if (this.initialized) return;

            try {
                // Fetch any SSR-compatible initial data
                const config = useRuntimeConfig();

                // Initialize app configuration
                this.config = {
                    maintenanceMode: false,
                    features: {},
                    ...config,
                };

                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize app store:', error);
                throw error;
            }
        },

        setFeature(key: string, enabled: boolean) {
            this.config.features[key] = enabled;
        },

        setMaintenanceMode(enabled: boolean) {
            this.config.maintenanceMode = enabled;
        },
    },
});
