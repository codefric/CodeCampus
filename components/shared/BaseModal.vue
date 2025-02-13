<script setup lang="ts">
import { useUIStore } from '~/store/ui';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition = 'top' | 'center';

const props = defineProps<{
    modalId: string;
    title?: string;
    persist?: boolean;
    size?: ModalSize;
    position?: ModalPosition;
}>();

// Default props
const size = computed(() => props.size || 'md');
const position = computed(() => props.position || 'center');

const uiStore = useUIStore();
const isOpen = computed(() => uiStore.isModalOpen(props.modalId));

// Size classes mapping
const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm w-full mx-4 sm:mx-auto',
    md: 'max-w-md w-full mx-4 sm:mx-auto',
    lg: 'max-w-lg w-full mx-4 sm:mx-auto',
    xl: 'max-w-xl w-full mx-4 sm:mx-auto',
    full: 'w-full h-full sm:h-auto sm:max-w-[90%] mx-4 sm:mx-auto',
};

// Position classes mapping
const positionClasses: Record<ModalPosition, string> = {
    top: 'flex items-start',
    center: 'flex items-center',
};

const closeModal = () => {
    uiStore.closeModal(props.modalId);
};

const handleClickOutside = () => {
    if (!props.persist) {
        closeModal();
    }
};

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
        closeModal();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleEscKey);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
    <ClientOnly>
        <Teleport to="body">
            <!-- Backdrop transition -->
            <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="isOpen"
                    class="fixed inset-0 z-50"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="modalId"
                >
                    <!-- Backdrop -->
                    <div
                        class="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50"
                        aria-hidden="true"
                    />

                    <!-- Modal Container -->
                    <div
                        class="fixed inset-0 overflow-y-auto"
                        :class="[positionClasses[position]]"
                    >
                        <!-- Modal Content Wrapper -->
                        <div
                            class="relative w-full transform"
                            :class="[position === 'top' ? 'pt-6' : '', position === 'center' ? 'min-h-full flex items-center' : '']"
                        >
                            <!-- Modal Content with custom transition -->
                            <div
                                v-click-outside="handleClickOutside"
                                class="mx-auto rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transform transition-all duration-300"
                                :class="[
                                    sizeClasses[size],
                                    {
                                        '-translate-y-full opacity-0': !isOpen,
                                        'translate-y-0 opacity-100': isOpen,
                                    },
                                ]"
                            >
                                <!-- Close button -->
                                <button
                                    type="button"
                                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    @click="closeModal"
                                >
                                    <span class="sr-only">Close</span>
                                    <Icon
                                        name="heroicons:x-mark"
                                        class="h-5 w-5"
                                    />
                                </button>

                                <!-- Title -->
                                <div
                                    v-if="title"
                                    :id="modalId"
                                    class="mb-4"
                                >
                                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                        {{ title }}
                                    </h3>
                                </div>

                                <!-- Content -->
                                <div class="mt-2">
                                    <slot />
                                </div>

                                <!-- Footer -->
                                <div
                                    v-if="$slots.footer"
                                    class="mt-6"
                                >
                                    <slot
                                        name="footer"
                                        :close="closeModal"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>

<style scoped>
.translate-enter-active,
.translate-leave-active {
    transition: all 0.3s ease-out;
}

.translate-enter-from,
.translate-leave-to {
    opacity: 0;
    transform: translateY(-60px);
}
</style>
