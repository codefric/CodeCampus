// nuxt.config.ts
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],

    // Runtime config
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
        },
    },

    // Route rules for caching and performance
    routeRules: {
        // Public content - cached and static where possible
        '/': {
            swr: true,
        },
        '/courses': {
            swr: true,
        },
        '/courses/**': {
            swr: 3600, // Cache course pages for 1 hour
        },
        '/blog/**': {
            swr: true,
        },
        '/about': {
            static: true,
        },

        // Dynamic authenticated routes - no caching
        '/dashboard/**': {
            swr: false,
        },
        '/my-courses/**': {
            swr: false,
        },
        '/api/**': {
            cors: true,
            headers: {
                'Access-Control-Allow-Credentials': 'true',
            },
        },
    },

    // App configuration
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        layoutTransition: { name: 'layout', mode: 'out-in' },
        head: {
            title: 'Your Learning Platform',
        },
    },

    // Auto-imports
    imports: {
        dirs: ['composables/**', 'composables/api/**', 'utils/**'],
    },
});
