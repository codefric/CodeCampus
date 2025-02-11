import { useEnrollmentStatus } from "~/composables/useEnrollmentStatus";

export default defineNuxtRouteMiddleware(async (to) => {
    const { $auth } = useNuxtApp();
    const courseId = to.params.courseId as string;

    // Allow preview content without auth
    if (to.path.includes('/preview')) {
        return;
    }

    // Check enrollment for authenticated users
    if ($auth?.isAuthenticated?.value) {
        const { isEnrolled, hasExpired } = await useEnrollmentStatus(courseId);

        if (!isEnrolled.value) {
            return navigateTo(`/courses/${courseId}?error=not_enrolled`);
        }

        if (hasExpired.value) {
            return navigateTo(`/courses/${courseId}?error=enrollment_expired`);
        }
    } else {
        // Redirect unauthenticated users to course landing page
        return navigateTo(`/courses/${courseId}`);
    }
});
