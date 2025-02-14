<script setup lang="ts">
export interface BannerProps {
    id: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    dismissible?: boolean;
    collapsible?: boolean;
}

const props = withDefaults(defineProps<BannerProps>(), {
    type: 'info',
    dismissible: true,
    collapsible: true,
});

const { isVisible, isCollapsed, hide, toggleCollapse } = useBanner(props.id);

const typeStyles = computed(
    () =>
        ({
            info: {
                bg: 'bg-blue-50',
                border: 'border-blue-300',
                text: 'text-blue-800',
                icon: 'ph:info',
            },
            success: {
                bg: 'bg-green-50',
                border: 'border-green-300',
                text: 'text-green-800',
                icon: 'ph:check-circle',
            },
            warning: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-300',
                text: 'text-yellow-800',
                icon: 'ph:warning',
            },
            error: {
                bg: 'bg-red-50',
                border: 'border-red-300',
                text: 'text-red-800',
                icon: 'ph:x-circle',
            },
        })[props.type]
);
</script>

<template>
    <Transition
        appear
        :show="isVisible"
        enter="transition-all duration-300"
        enter-from="-translate-y-full opacity-0"
        enter-to="translate-y-0 opacity-100"
        leave="transition-all duration-300"
        leave-from="translate-y-0 opacity-100"
        leave-to="-translate-y-full opacity-0"
    >
        <div
            v-show="isVisible"
            :class="['relative border rounded-lg shadow-sm p-4 mb-4', typeStyles.bg, typeStyles.border, typeStyles.text]"
        >
            <div class="flex items-start gap-4">
                <!-- Icon -->
                <Icon
                    :name="typeStyles.icon"
                    class="w-5 h-5 mt-0.5 flex-shrink-0"
                />

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="font-medium mb-1">
                        <slot name="title" />
                    </div>
                    <div :class="['text-sm transition-all duration-300 overflow-hidden', isCollapsed ? 'max-h-0' : 'max-h-96']">
                        <slot />
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-start gap-2 ml-4">
                    <SharedBaseButton
                        v-if="collapsible"
                        type="button"
                        variant="icon-only"
                        @click="toggleCollapse"
                    >
                        <template #leading-icon>
                            <Icon
                                :name="isCollapsed ? 'ph:caret-down' : 'ph:caret-up'"
                                class="w-5 h-5"
                            />
                        </template>
                    </SharedBaseButton>
                    <SharedBaseButton
                        v-if="dismissible"
                        type="button"
                        variant="icon-only"
                        @click="hide"
                    >
                        <template #leading-icon>
                            <Icon
                                name="ph:x"
                                class="w-5 h-5"
                            />
                        </template>
                    </SharedBaseButton>
                </div>
            </div>
        </div>
    </Transition>
</template>
