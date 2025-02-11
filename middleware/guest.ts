// middleware/guest.ts
export default defineNuxtRouteMiddleware((to) => {
    const { $auth } = useNuxtApp();

    if ($auth?.isAuthenticated?.value) {
        // If there's a redirect parameter, use it
        const redirect = to.query.redirect as string;
        return navigateTo(redirect || '/dashboard');
    }
});
