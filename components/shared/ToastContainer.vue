<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUIStore } from '~/store/ui';

const uiStore = useUIStore();
const { activeNotifications: notifications } = storeToRefs(uiStore);
const { removeNotification } = uiStore;

// Toast type configurations
const toastTypeStyles = {
    success: 'bg-green-100 dark:bg-green-800',
    error: 'bg-red-100 dark:bg-red-800',
    warning: 'bg-yellow-100 dark:bg-yellow-800',
    info: 'bg-blue-100 dark:bg-blue-800',
} as const;

const toastTextStyles = {
    success: 'text-green-800 dark:text-green-100',
    error: 'text-red-800 dark:text-red-100',
    warning: 'text-yellow-800 dark:text-yellow-100',
    info: 'text-blue-800 dark:text-blue-100',
} as const;

const toastIconStyles = {
    success: 'text-green-600 dark:text-green-200',
    error: 'text-red-600 dark:text-red-200',
    warning: 'text-yellow-600 dark:text-yellow-200',
    info: 'text-blue-600 dark:text-blue-200',
} as const;

const toastCloseButtonStyles = {
    success: 'hover:bg-green-200 dark:hover:bg-green-700',
    error: 'hover:bg-red-200 dark:hover:bg-red-700',
    warning: 'hover:bg-yellow-200 dark:hover:bg-yellow-700',
    info: 'hover:bg-blue-200 dark:hover:bg-blue-700',
} as const;

const toastTypeIcon = {
    success: 'heroicons:check-circle',
    error: 'heroicons:exclamation-circle',
    warning: 'heroicons:exclamation-triangle',
    info: 'heroicons:information-circle',
} as const;
</script>

<template>
    <TransitionGroup
        tag="div"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
        class="fixed top-4 right-4 z-50 flex flex-col gap-2"
    >
        <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="['rounded-lg shadow-lg p-4 flex items-start gap-3 w-96', toastTypeStyles[notification.type]]"
            role="alert"
        >
            <div class="flex-shrink-0 pt-0.5">
                <Icon
                    :name="toastTypeIcon[notification.type]"
                    class="w-5 h-5"
                    :class="toastIconStyles[notification.type]"
                />
            </div>

            <div class="flex-1 mr-2">
                <p
                    class="text-sm font-medium"
                    :class="toastTextStyles[notification.type]"
                >
                    {{ notification.message }}
                </p>
            </div>

            <button
                class="flex-shrink-0 rounded-md p-1.5 transition-colors"
                :class="toastCloseButtonStyles[notification.type]"
                aria-label="Close notification"
                @click="removeNotification(notification.id)"
            >
                <Icon
                    name="heroicons:x-mark"
                    class="w-4 h-4"
                />
            </button>
        </div>
    </TransitionGroup>
</template>
