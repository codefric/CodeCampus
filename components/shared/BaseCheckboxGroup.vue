<script setup lang="ts">
import type { CheckboxSize } from './BaseCheckbox.vue';

interface Option {
    label: string;
    value: any;
    description?: string;
    disabled?: boolean;
}

interface Props {
    modelValue: any[];
    options: Option[];
    name?: string;
    size?: CheckboxSize;
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
    (e: 'update:modelValue', value: any[]): void;
}>();

const containerClasses = computed(() => [
    'flex',
    {
        'flex-col gap-4': props.orientation === 'vertical',
        'flex-row gap-6': props.orientation === 'horizontal',
    },
]);

const isChecked = (value: any) => props.modelValue.includes(value);

const handleChange = (value: any) => {
    const newValue = [...props.modelValue];
    const index = newValue.indexOf(value);

    if (index === -1) {
        newValue.push(value);
    } else {
        newValue.splice(index, 1);
    }

    emit('update:modelValue', newValue);
};
</script>

<template>
    <div
        role="group"
        :class="containerClasses"
    >
        <SharedBaseCheckbox
            v-for="option in options"
            :key="option.value"
            :model-value="isChecked(option.value)"
            :label="option.label"
            :description="option.description"
            :disabled="option.disabled"
            :size="size"
            :name="name"
            :error="error"
            @update:model-value="() => handleChange(option.value)"
        />
    </div>
</template>
