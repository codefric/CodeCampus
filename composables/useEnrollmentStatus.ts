import type { Enrollment } from "~/types/course";

export async function useEnrollmentStatus(courseId: string | number) {
    const config = useRuntimeConfig();
    const { useGet } = useHttp(config.public.apiBase);

    const { data: enrollment, error, refresh } = await useGet<Enrollment | null>(`/enrollments/check/${courseId}`);

    const isEnrolled = computed(() => {
        return enrollment.value?.status === 'active' || enrollment.value?.status === 'completed';
    });

    const hasExpired = computed(() => {
        return enrollment.value?.status === 'expired';
    });

    const enrollmentStatus = computed(() => enrollment.value?.status);

    return {
        enrollment,
        isEnrolled,
        hasExpired,
        enrollmentStatus,
        error,
        refresh,
    };
}
