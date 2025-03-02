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
    rounded?: boolean;
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
    rounded: false,
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

const stateClasses = computed(() => {
    // Base classes for all states
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all text-sm font-semibold font-nunito';
    const roundedClasses = props.rounded ? 'rounded-full' : 'rounded-[4px]';

    // Common active class for multiple states
    const activeClass = 'border border-[#3A2A56] bg-[#3A2A56] text-white';

    // Select the appropriate class based on state, error, and active
    let stateClass = '';

    if (props.error) {
        stateClass =
            'border border-[#3A2A56] bg-white text-[#3A2A56] hover:bg-[#3A2A56] hover:text-white active:bg-[#3A2A56] active:text-white';
    } else if (props.disabled || props.isLoading) {
        stateClass = 'bg-white opacity-50 cursor-not-allowed !border-[#3A2A56] !text-[#3A2A56]';
    } else if (props.active) {
        // Different active states
        if (props.state === 'default') {
            stateClass = activeClass;
        } else if (props.state === 'semi-filled') {
            stateClass = activeClass;
        } else if (props.state === 'filled') {
            stateClass = activeClass;
        } else if (props.state === 'outline') {
            stateClass = activeClass;
        }
    } else {
        // Default states (not active)
        if (props.state === 'default') {
            stateClass =
                'border border-transparent bg-white text-[#3B2A56] hover:!border-[#3A2A56] hover:!bg-white active:!bg-[#3A2A56] active:!border-[#3A2A56] active:!text-white';
        } else if (props.state === 'semi-filled') {
            stateClass =
                'border border-[#3A2A56] bg-white text-[#3B2A56] hover:border-[#3A2A56] hover:bg-white active:bg-[#3A2A56] active:text-white';
        } else if (props.state === 'filled') {
            stateClass =
                'border border-[#3A2A56] bg-[#3A2A56] text-white hover:border-[#3A2A56] hover:bg-[#3A2A56] active:border-[#3A2A56] active:bg-[#3A2A56]';
        } else if (props.state === 'outline') {
            stateClass = 'bg-white border border-[#3A2A56] text-[#3B2A56] hover:border-[#3A2A56] active:bg-[#3A2A56] active:text-white';
        }
    }

    return `${baseClasses} ${roundedClasses} ${stateClass} ${props.className}`;
});
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
                :class="[textClass, 'text-sm leading-5 font-normal text-center font-nunito line-clamp-1']"
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
    border-color: rgba(58, 42, 86, 0.2);
    border-right-color: #3a2a56;
    animation: spinner-d3wgkg 0.8s infinite linear;
}

@keyframes spinner-d3wgkg {
    to {
        transform: rotate(1turn);
    }
}
</style>
