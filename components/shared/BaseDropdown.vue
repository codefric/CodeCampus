<script setup lang="ts">
interface Props {
    items: any[];
    label?: string;
    buttonState?: 'filled' | 'semi-filled' | 'outline' | 'default';
    buttonSize?: 'sm' | 'md' | 'lg';
    buttonVariant?: 'default' | 'icon-only' | 'leading-icon' | 'trailing-icon' | 'both-icons';
    disabled?: boolean;
    error?: boolean;
    maxHeight?: string;
    width?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    buttonState: 'default',
    buttonSize: 'md',
    buttonVariant: 'leading-icon',
    disabled: false,
    error: false,
    maxHeight: '300px',
    width: 'auto',
});

const emit = defineEmits<{
    (e: 'select', item: any): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const position = ref({ top: '0px', left: '0px' });
const placement = ref<'top' | 'bottom'>('bottom');

const closeDropdown = () => {
    isOpen.value = false;
};

// Calculate dropdown position
const calculatePosition = async () => {
    // Wait for the dropdown to be rendered
    await nextTick();

    // Get the DOM element directly
    const triggerElement = (triggerRef.value as any)?.$el || triggerRef.value;
    const dropdownElement = dropdownRef.value;

    if (!triggerElement || !dropdownElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const dropdownRect = dropdownElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // Add offset for spacing between trigger and dropdown
    const offset = 8; // 8px spacing

    // Determine if dropdown should appear above or below
    if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
        placement.value = 'top';
        position.value = {
            top: `${triggerRect.top - dropdownRect.height - offset}px`,
            left: `${triggerRect.left}px`,
        };
    } else {
        placement.value = 'bottom';
        position.value = {
            top: `${triggerRect.bottom + offset}px`,
            left: `${triggerRect.left}px`,
        };
    }

    // Adjust horizontal position if needed
    const viewportWidth = window.innerWidth;
    if (triggerRect.left + dropdownRect.width > viewportWidth) {
        const overflow = triggerRect.left + dropdownRect.width - viewportWidth;
        position.value.left = `${triggerRect.left - overflow - 16}px`;
    }
};

// Toggle dropdown
const toggleDropdown = async () => {
    if (!props.disabled) {
        isOpen.value = !isOpen.value;
        if (isOpen.value) {
            await calculatePosition();
        }
    }
};

// Watch for isOpen changes to recalculate position
watch(isOpen, async (newValue) => {
    if (newValue) {
        await calculatePosition();
    }
});

// Handle window resize and scroll
const handleResize = () => {
    if (isOpen.value) {
        calculatePosition();
    }
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleResize);
});

// Computed width style
const dropdownWidth = computed(() => {
    if (props.width === 'auto' && triggerRef.value) {
        return `${triggerRef.value.offsetWidth}px`;
    }
    return props.width;
});
</script>

<template>
    <div
        v-click-outside="closeDropdown"
        class="relative"
    >
        <!-- Trigger Button -->
        <SharedBaseButton
            ref="triggerRef"
            :state="buttonState"
            :size="buttonSize"
            :variant="buttonVariant"
            :disabled="disabled"
            :error="error"
            @click="toggleDropdown"
        >
            <template #leading-icon>
                <slot name="trigger-icon" />
            </template>
            {{ label }}
            <template #trailing-icon>
                <Icon
                    name="ph:caret-down-bold"
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                />
            </template>
        </SharedBaseButton>

        <!-- Dropdown Content -->
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <div
                v-if="isOpen"
                ref="dropdownRef"
                class="fixed z-50 min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                :class="{
                    'origin-top-right': placement === 'bottom',
                    'origin-bottom-right': placement === 'top',
                }"
                :style="{
                    top: position.top,
                    left: position.left,
                    width: dropdownWidth,
                    maxHeight: maxHeight,
                }"
            >
                <div class="py-1 overflow-auto flex flex-col">
                    <template
                        v-for="(item, index) in items"
                        :key="index"
                    >
                        <!-- Default item template -->
                        <SharedBaseButton
                            v-if="!$slots.item"
                            state="default"
                            variant="default"
                            class="w-full justify-start rounded-none hover:bg-gray-50"
                            @click="
                                () => {
                                    emit('select', item);
                                    closeDropdown();
                                }
                            "
                        >
                            {{ item.label }}
                        </SharedBaseButton>

                        <!-- Custom item template -->
                        <slot
                            v-else
                            name="item"
                            :item="item"
                            :select="
                                () => {
                                    emit('select', item);
                                    closeDropdown();
                                }
                            "
                        />
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>
