<script setup lang="ts">
import type { DrawerPlacement, DrawerSize } from '~/store/ui';

const props = withDefaults(
    defineProps<{
        isOpen: boolean;
        placement?: DrawerPlacement;
        size?: DrawerSize;
        closeOnBackdrop?: boolean;
    }>(),
    {
        placement: 'right',
        size: 'md',
        closeOnBackdrop: true,
    }
);

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'close'): void;
}>();

const sizeClass = computed(() => {
    if (typeof props.size === 'number') {
        return `w-[${props.size}px]`;
    }

    const sizes: Record<string, string> = {
        sm: 'w-64',
        md: 'w-96',
        lg: 'w-[440px]',
        xl: 'w-[600px]',
        full: 'w-screen',
    };

    return sizes[props.size] || sizes.md;
});

const placementClass = computed(() => {
    return props.placement === 'left' ? 'left-0 top-0' : 'right-0 top-0';
});

const transitionClasses = computed(() => {
    const base = 'transition ease-in-out duration-300 transform';
    const from = props.placement === 'left' ? '-translate-x-full' : 'translate-x-full';
    const to = 'translate-x-0';

    return {
        enter: base,
        enterFrom: from,
        enterTo: to,
        leave: base,
        leaveFrom: to,
        leaveTo: from,
    };
});

const onBackdropClick = () => {
    if (props.closeOnBackdrop) {
        emit('update:isOpen', false);
        emit('close');
    }
};
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-black bg-opacity-50 z-40"
                @click="onBackdropClick"
            />
        </Transition>

        <Transition
            :enter-active-class="transitionClasses.enter"
            :enter-from-class="transitionClasses.enterFrom"
            :enter-to-class="transitionClasses.enterTo"
            :leave-active-class="transitionClasses.leave"
            :leave-from-class="transitionClasses.leaveFrom"
            :leave-to-class="transitionClasses.leaveTo"
        >
            <div
                v-if="isOpen"
                :class="['fixed z-50 bg-white dark:bg-gray-800 h-full shadow-xl', placementClass, sizeClass]"
            >
                <div class="h-full flex flex-col">
                    <div
                        v-if="$slots.header"
                        class="px-4 py-3 border-b dark:border-gray-700"
                    >
                        <slot name="header" />
                    </div>

                    <div class="flex-1 overflow-y-auto p-4">
                        <slot />
                    </div>

                    <div
                        v-if="$slots.footer"
                        class="px-4 py-3 border-t dark:border-gray-700"
                    >
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
