<script setup lang="ts">
export type CheckboxSize = 'sm' | 'md' | 'lg';

interface Props {
    modelValue?: boolean;
    label?: string;
    size?: CheckboxSize;
    disabled?: boolean;
    name?: string;
    error?: boolean;
    description?: string;
    indeterminate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    size: 'md',
    disabled: false,
    error: false,
    indeterminate: false,
    description: '',
    label: '',
    name: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const sizeClasses = computed(
    () =>
        ({
            sm: {
                checkbox: 'w-4 h-4',
                label: 'text-sm',
                description: 'text-xs',
            },
            md: {
                checkbox: 'w-5 h-5',
                label: 'text-base',
                description: 'text-sm',
            },
            lg: {
                checkbox: 'w-6 h-6',
                label: 'text-lg',
                description: 'text-base',
            },
        })[props.size]
);

const checkboxClasses = computed(() => [
    'relative shrink-0 rounded border-2 transition-all duration-150',
    sizeClasses.value.checkbox,
    {
        'border-gray-300 bg-white': !props.modelValue && !props.error && !props.indeterminate,
        'border-blue-500 bg-blue-500': (props.modelValue || props.indeterminate) && !props.error,
        'border-red-500': props.error,
        'opacity-50 cursor-not-allowed': props.disabled,
        'cursor-pointer': !props.disabled,
    },
]);

const containerClasses = computed(() => [
    'flex gap-2',
    {
        'cursor-pointer': !props.disabled,
        'cursor-not-allowed opacity-50': props.disabled,
    },
]);

const handleClick = () => {
    if (!props.disabled) {
        emit('update:modelValue', !props.modelValue);
    }
};
</script>

<template>
    <div
        :class="containerClasses"
        @click="handleClick"
    >
        <div :class="checkboxClasses">
            <Icon
                v-if="modelValue && !indeterminate"
                name="ph:check-bold"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                :class="sizeClasses.checkbox"
            />
            <div
                v-if="indeterminate"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-0.5 bg-white rounded"
            />
        </div>
        <div v-if="label || description">
            <label :class="[sizeClasses.label, 'font-medium text-gray-900', { 'cursor-pointer': !disabled }]">
                {{ label }}
            </label>
            <p
                v-if="description"
                :class="[sizeClasses.description, 'text-gray-500 mt-0.5']"
            >
                {{ description }}
            </p>
        </div>
    </div>
</template>
