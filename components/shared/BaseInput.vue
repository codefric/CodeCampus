<script setup lang="ts">
interface Props {
    modelValue?: string | number;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    size?: 'sm' | 'md' | 'lg';
    state?: 'default' | 'success' | 'error';
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    clearable?: boolean;
    autofocus?: boolean;
    name?: string;
    id?: string;
    autocomplete?: string;
    maxlength?: number;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    size: 'md',
    label: '',
    state: 'default',
    disabled: false,
    readonly: false,
    required: false,
    clearable: false,
    autofocus: false,
    autocomplete: '',
    id: '',
    max: 8,
    min: 1,
    maxlength: 5,
    name: '',
    pattern: '',
    placeholder: '',
    step: 1,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'change', value: string | number): void;
    (e: 'focus', event: FocusEvent): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'clear'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

const sizeClasses = computed(() => {
    const sizes = {
        sm: 'h-8 text-sm',
        md: 'h-10 text-base',
        lg: 'h-12 text-lg',
    };
    return sizes[props.size];
});

const paddingClasses = computed(() => {
    const hasPrefixIcon = !!slots['prefix-icon'];
    const hasSuffixIcon = !!slots['suffix-icon'] || props.clearable;

    const basePadding = {
        sm: hasPrefixIcon ? 'pl-8' : 'pl-3',
        md: hasPrefixIcon ? 'pl-10' : 'pl-4',
        lg: hasPrefixIcon ? 'pl-12' : 'pl-6',
    };

    const suffixPadding = {
        sm: hasSuffixIcon ? 'pr-8' : 'pr-3',
        md: hasSuffixIcon ? 'pr-10' : 'pr-4',
        lg: hasSuffixIcon ? 'pr-12' : 'pr-6',
    };

    return `${basePadding[props.size]} ${suffixPadding[props.size]}`;
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
    const states = {
        default: `
            border-[#D5D7DA] bg-white
            focus:border-[#75E0A7] focus:ring-[#DCFAE6]
            hover:border-[#75E0A7]
        `,
        success: `
            border-[#47CD89] bg-white
            focus:border-[#47CD89] focus:ring-[#DCFAE6]
            hover:border-[#47CD89]
        `,
        error: `
            border-red-500 bg-white
            focus:border-red-500 focus:ring-red-100
            hover:border-red-600
        `,
    };

    if (props.disabled) {
        return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    return states[props.state];
});

const slots = useSlots();

const clear = () => {
    emit('update:modelValue', '');
    emit('clear');
    inputRef.value?.focus();
};

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};

const onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
};

const onBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('change', target.value);
};
</script>

<template>
    <div class="relative">
        <input
            :id="id"
            ref="inputRef"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :autofocus="autofocus"
            :name="name"
            :autocomplete="autocomplete"
            :maxlength="maxlength"
            :min="min"
            :max="max"
            :step="step"
            :pattern="pattern"
            :class="[
                'w-full rounded-xl border transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                sizeClasses,
                paddingClasses,
                stateClasses,
            ]"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @change="onChange"
        >

        <!-- Prefix Icon -->
        <div
            v-if="$slots['prefix-icon']"
            class="absolute left-0 top-0 flex items-center justify-center h-full"
            :class="{
                'pl-3': size === 'sm',
                'pl-4': size === 'md',
                'pl-6': size === 'lg',
            }"
        >
            <slot
                name="prefix-icon"
                :size="iconSizeClass"
                :focused="isFocused"
            />
        </div>

        <!-- Suffix Icon -->
        <div
            v-if="$slots['suffix-icon'] || (clearable && modelValue)"
            class="absolute right-0 top-0 flex items-center justify-center h-full"
            :class="{
                'pr-3': size === 'sm',
                'pr-4': size === 'md',
                'pr-6': size === 'lg',
            }"
        >
            <template v-if="clearable && modelValue">
                <button
                    type="button"
                    class="p-1 rounded-full hover:bg-gray-100"
                    @click="clear"
                >
                    <Icon
                        name="ph:x-bold"
                        :class="iconSizeClass"
                    />
                </button>
            </template>
            <slot
                v-else
                name="suffix-icon"
                :size="iconSizeClass"
                :focused="isFocused"
            />
        </div>
    </div>
</template>
