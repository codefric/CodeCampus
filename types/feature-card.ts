export interface FeatureCardData {
    title: string;
    description: string;
    iconColor: string; // Color of the icon container
    linkUrl: string;
    linkText: string;
    className?: string; // Optional class name for the card container
    smallIcon?: string;
}

export interface Course {
    id: number;
    title: string;
    price: string;
    rating: number;
    reviewCount: number;
    image: string;
    level: 'Beginner' | 'Intermediate' | 'Advance';
    lessonCount: number;
    duration: string;
}
