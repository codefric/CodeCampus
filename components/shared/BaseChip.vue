<!-- components/shared/BaseChip.vue -->
<script setup lang="ts">
export type ChipSize = 'sm' | 'md' | 'lg';
export type ChipVariant = 'solid' | 'outline' | 'soft';
export type ChipColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface Props {
    label?: string;
    size?: ChipSize;
    variant?: ChipVariant;
    color?: ChipColor;
    clickable?: boolean;
    closeable?: boolean;
    disabled?: boolean;
    active?: boolean;
    icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'solid',
    color: 'default',
    clickable: false,
    closeable: false,
    disabled: false,
    active: false,
    label: '',
    icon: '',
});

defineEmits<{
    (e: 'click'): void;
    (e: 'close'): void;
}>();

const sizeClasses = computed(
    () =>
        ({
            sm: 'text-xs px-2 py-0.5 gap-1',
            md: 'text-sm px-3 py-1 gap-1.5',
            lg: 'text-base px-4 py-1.5 gap-2',
        })[props.size]
);

const iconSizeClasses = computed(
    () =>
        ({
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
        })[props.size]
);

const variantClasses = computed(() => {
    const variants = {
        solid: {
            default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            primary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
            success: 'bg-green-100 text-green-700 hover:bg-green-200',
            warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
            error: 'bg-red-100 text-red-700 hover:bg-red-200',
            info: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
        },
        outline: {
            default: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            primary: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
            success: 'border border-green-300 text-green-700 hover:bg-green-50',
            warning: 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50',
            error: 'border border-red-300 text-red-700 hover:bg-red-50',
            info: 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50',
        },
        soft: {
            default: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
            primary: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
            success: 'bg-green-50 text-green-700 hover:bg-green-100',
            warning: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
            error: 'bg-red-50 text-red-700 hover:bg-red-100',
            info: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        },
    };
    return variants[props.variant][props.color];
});

const rootClasses = computed(() => [
    'inline-flex items-center rounded-full font-medium transition-colors duration-150',
    sizeClasses.value,
    variantClasses.value,
    {
        'cursor-pointer': props.clickable && !props.disabled,
        'opacity-50 cursor-not-allowed': props.disabled,
        'ring-2 ring-offset-2': props.active,
        [`ring-${props.color}-500`]: props.active && props.color !== 'default',
        'ring-gray-500': props.active && props.color === 'default',
    },
]);
</script>

<template>
    <div
        :class="rootClasses"
        @click="!disabled && clickable && $emit('click')"
    >
        <Icon
            v-if="icon"
            :name="icon"
            :class="iconSizeClasses"
        />
        <span>
            <slot>{{ label }}</slot>
        </span>
        <button
            v-if="closeable && !disabled"
            type="button"
            class="flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            :class="iconSizeClasses"
            @click.stop="$emit('close')"
        >
            <Icon
                name="ph:x"
                :class="iconSizeClasses"
            />
        </button>
    </div>
</template>
