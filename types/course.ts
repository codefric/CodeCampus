export interface Enrollment {
    courseId: string | number;
    userId: string | number;
    status: 'active' | 'completed' | 'expired';
    enrolledAt: string;
    expiresAt?: string;
}
