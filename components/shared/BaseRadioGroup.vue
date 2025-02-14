<script setup lang="ts">
import type { RadioSize } from './BaseRadio.vue';

interface Option {
    label: string;
    value: any;
    description?: string;
    disabled?: boolean;
}

interface Props {
    modelValue: any;
    options: Option[];
    name?: string;
    size?: RadioSize;
    orientation?: 'horizontal' | 'vertical';
    error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    orientation: 'vertical',
    error: false,
    name: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const containerClasses = computed(() => [
    'flex',
    {
        'flex-col gap-4': props.orientation === 'vertical',
        'flex-row gap-6': props.orientation === 'horizontal',
    },
]);

// Create a computed property for internal value management
const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});
</script>

<template>
    <div
        role="radiogroup"
        :class="containerClasses"
    >
        <SharedBaseRadio
            v-for="option in options"
            :key="option.value"
            v-model="selectedValue"
            :value="option.value"
            :label="option.label"
            :description="option.description"
            :disabled="option.disabled"
            :size="size"
            :name="name"
            :error="error"
        />
    </div>
</template>
