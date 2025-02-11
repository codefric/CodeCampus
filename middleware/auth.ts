export default defineNuxtRouteMiddleware((to) => {
    const { $auth } = useNuxtApp();

    if (!$auth.isAuthenticated.value && to.path !== '/login') {
        return navigateTo('/login');
    }

    if ($auth.isAuthenticated.value && to.path === '/login') {
        return navigateTo('/dashboard');
    }
});
