<script setup lang="ts">
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'default' | 'icon-only' | 'leading-icon' | 'trailing-icon' | 'both-icons';
export type ButtonState = 'filled' | 'semi-filled' | 'outline' | 'default';

interface Props {
    label?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
    state?: ButtonState;
    disabled?: boolean;
    error?: boolean;
    isLoading?: boolean;
    className?: string;
    innerClassName?: string;
    textClass?: string;
    active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'default',
    state: 'default',
    disabled: false,
    error: false,
    label: '',
    isLoading: false,
    className: '',
    innerClassName: '',
    textClass: '',
    active: false,
});

defineEmits<{
    (e: 'click'): void;
}>();

const isIconOnly = computed(() => props.variant === 'icon-only');
const hasLeadingIcon = computed(() => ['leading-icon', 'icon-only', 'both-icons'].includes(props.variant));
const hasTrailingIcon = computed(() => ['trailing-icon', 'both-icons'].includes(props.variant));

const sizeClasses = computed(() => {
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
    };
    return sizes[props.size];
});

const iconSizeClass = computed(() => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };
    return sizes[props.size];
});

const stateClasses = computed(() => ({
    'inline-flex items-center justify-center rounded-xl font-medium transition-all text-[14px] font-semibold': true,

    // Default state with active
    'border border-transparent bg-white hover:!border-[#DCFAE6] hover:!bg-[#ECFDF3] active:!bg-[#DCFAE6] active:!border-[#ABEFC6]':
        props.state === 'default' && !props.error && !props.active,
    'border border-[#ABEFC6] bg-[#DCFAE6]': props.state === 'default' && !props.error && props.active,

    // Semi-filled state with active
    'border border-[#D5D7DA] bg-gradient-to-b from-white to-[#FAFAFA] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#75E0A7] hover:bg-gradient-to-b hover:from-white hover:to-[#ECFDF3] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#47CD89] active:bg-gradient-to-b active:from-[#DCFAE6] active:to-[#ABEFC6] active:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]':
        props.state === 'semi-filled' && !props.error && !props.active,
    'border border-[#47CD89] bg-gradient-to-b from-[#DCFAE6] to-[#ABEFC6] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]':
        props.state === 'semi-filled' && !props.error && props.active,

    // Filled state with active
    'border border-[#47CD89] bg-gradient-to-b from-[#DCFAE6] to-[#ABEFC6] shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] hover:border-[#47CD89] hover:bg-gradient-to-b hover:from-[#ABEFC6] hover:to-[#75E0A7] hover:shadow-[0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)] active:border-[#47CD89] active:bg-gradient-to-b active:from-[#75E0A7] active:to-[#47CD89] active:shadow-[0px_20px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]':
        props.state === 'filled' && !props.error && !props.active,
    'border border-[#47CD89] bg-gradient-to-b from-[#75E0A7] to-[#47CD89] shadow-[0px_20px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_2px_rgba(0,0,0,0.05)_inset,0px_1px_2px_rgba(0,0,0,0.05)]':
        props.state === 'filled' && !props.error && props.active,

    // Outline state with active
    'bg-white border border-[#E9EAEB] hover:border-[#75E0A7] active:bg-[#DCFAE6] active:border-[#ABEFC6]':
        props.state === 'outline' && !props.error && !props.active,
    'bg-[#DCFAE6] border border-[#ABEFC6]': props.state === 'outline' && !props.error && props.active,

    // Error states
    'border border-red-500 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200': props.error,

    // Disabled state
    'bg-gradient-to-b from-white to-gray-50 opacity-50 cursor-not-allowed !border-gray-300 hover:!bg-gradient-to-b hover:!from-white hover:!to-gray-50 active:!bg-gradient-to-b active:!from-white active:!to-gray-50':
        props.disabled || props.isLoading,

    [props.className]: true,
}));
</script>

<template>
    <button
        :class="[stateClasses, sizeClasses]"
        :disabled="disabled || isLoading"
        @click="$emit('click')"
    >
        <div
            class="flex items-center gap-2 w-max"
            :class="innerClassName"
        >
            <span
                v-if="hasLeadingIcon"
                :class="[iconSizeClass, !isIconOnly && 'mr-2']"
            >
                <slot name="leading-icon" />
            </span>

            <span
                v-if="!isIconOnly"
                :class="[textClass, 'text-[14px] leading-5 font-semibold text-[#414651] font-inter line-clamp-1']"
            >
                <slot>{{ label }}</slot>
            </span>

            <span
                v-if="hasTrailingIcon && !isLoading"
                :class="[iconSizeClass, !isIconOnly && 'ml-2']"
            >
                <slot name="trailing-icon" />
            </span>
        </div>

        <span
            v-if="isLoading"
            class="spinner ml-2"
        />
    </button>
</template>

<style scoped lang="css">
.spinner {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid;
    border-color: rgb(220, 250, 230);
    border-right-color: #000000;
    animation: spinner-d3wgkg 0.8s infinite linear;
}

@keyframes spinner-d3wgkg {
    to {
        transform: rotate(1turn);
    }
}
</style>
