// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
    const { $auth } = useNuxtApp();

    // Routes that require authentication
    const protectedRoutes = [
        '/dashboard', // User dashboard
        '/my-courses', // Enrolled courses
        '/settings', // User settings
        '/progress', // Learning progress
        '/certificates', // Earned certificates
        '/checkout', // Payment/enrollment
        '/notes', // Course notes
    ];

    // Check if current route needs authentication
    const requiresAuth = protectedRoutes.some((route) => to.path.startsWith(route));

    if (requiresAuth && !$auth?.isAuthenticated?.value) {
        // Store the intended destination for post-login redirect
        const redirect = to.fullPath;
        return navigateTo(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
});
