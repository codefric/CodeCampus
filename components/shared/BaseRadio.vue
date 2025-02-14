<script setup lang="ts">
export type RadioSize = 'sm' | 'md' | 'lg';

interface Props {
    modelValue?: any;
    value: any;
    label?: string;
    size?: RadioSize;
    disabled?: boolean;
    name?: string;
    error?: boolean;
    description?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    disabled: false,
    error: false,
    description: '',
    label: '',
    modelValue: '',
    name: '',
    value: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const isChecked = computed(() => props.modelValue === props.value);

const sizeClasses = computed(
    () =>
        ({
            sm: {
                radio: 'w-4 h-4',
                label: 'text-sm',
                description: 'text-xs',
            },
            md: {
                radio: 'w-5 h-5',
                label: 'text-base',
                description: 'text-sm',
            },
            lg: {
                radio: 'w-6 h-6',
                label: 'text-lg',
                description: 'text-base',
            },
        })[props.size]
);

const radioClasses = computed(() => [
    'relative shrink-0 rounded-full border-2 transition-all duration-150',
    sizeClasses.value.radio,
    {
        'border-gray-300 bg-white': !isChecked.value && !props.error,
        'border-blue-500 bg-blue-500': isChecked.value && !props.error,
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
        emit('update:modelValue', props.value);
    }
};
</script>

<template>
    <div
        :class="containerClasses"
        @click="handleClick"
    >
        <div :class="radioClasses">
            <div
                v-show="isChecked"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4 rounded-full bg-white"
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
