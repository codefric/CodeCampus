# script section
<script setup lang="ts">
import type { DrawerPlacement, DrawerSize } from '~/store/ui';
import { useUIStore } from '~/store/ui';

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first());

useSeoMeta({
    title: home.value?.title,
    description: home.value?.description,
});

const toast = useToast();

const showSuccessToast = () => {
    toast.success('Operation completed successfully!');
};

const showErrorToast = () => {
    toast.error('Something went wrong', { timeout: 10000 });
};

const showPersistentWarning = () => {
    toast.warning('Please save your changes', { timeout: 100000 });
};

const uiStore = useUIStore();

// Modal configurations
const modalTypes = [
    {
        id: 'small-top-modal',
        buttonText: 'Open Small Top Modal',
        title: 'Small Top Modal',
        content: 'This is a small modal at the top of the screen.',
        size: 'sm',
        position: 'top',
    },
    {
        id: 'medium-modal',
        buttonText: 'Open Medium Modal',
        title: 'Medium Modal',
        content: 'This is a medium modal in the center.',
        size: 'md',
        position: 'center',
    },
    {
        id: 'large-modal',
        buttonText: 'Open Large Modal',
        title: 'Large Modal',
        content: 'This is a large modal.',
        size: 'lg',
        position: 'center',
    },
    {
        id: 'full-modal',
        buttonText: 'Open Full Modal',
        title: 'Full Modal',
        content: 'This takes up most of the screen width.',
        size: 'full',
        position: 'center',
    },
] as const;

// Keep track of which modal is active
const activeModal = reactive({
    id: '',
    title: '',
    content: '',
    size: 'md',
    position: 'center',
} as const);

const openModal = (modalId: string) => {
    const modalConfig = modalTypes.find((m) => m.id === modalId);
    if (modalConfig) {
        Object.assign(activeModal, modalConfig);
        uiStore.openModal(modalId);
    }
};

const drawer = useDrawer('unique-drawer-id');

// Drawer configuration state
const drawerConfig = reactive({
    placement: 'right' as DrawerPlacement,
    size: 'lg' as DrawerSize,
});

// Register drawer with options
onMounted(() => {
    drawer.register({
        size: drawerConfig.size,
        placement: drawerConfig.placement,
    });
});

// Clean up on unmount
onUnmounted(() => {
    drawer.unregister();
});
</script>

<template>
    <ContentRenderer
        v-if="home"
        :value="home"
    />
    <div v-else>
        <button @click="showSuccessToast">showSuccessToast</button>
        <button @click="showErrorToast">showErrorToast</button>
        <button @click="showPersistentWarning">showPersistentWarning</button>

        <div class="space-x-4">
            <button
                v-for="modalType in modalTypes"
                :key="modalType.id"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                @click="openModal(modalType.id)"
            >
                {{ modalType.buttonText }}
            </button>
        </div>

        <SharedBaseModal
            :modal-id="activeModal.id"
            :title="activeModal.title"
            :size="activeModal.size"
            :position="activeModal.position"
        >
            <p>{{ activeModal.content }}</p>
        </SharedBaseModal>

        <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            @click="drawer.toggle"
        >
            Toggle Drawer
        </button>

        <SharedDrawer
            v-model:is-open="drawer.isOpen.value"
            :placement="drawerConfig.placement"
            :size="drawerConfig.size"
            @close="drawer.close"
        >
            <template #header>
                <h2>Drawer Title</h2>
            </template>

            <div>Drawer Content</div>

            <template #footer>
                <button @click="drawer.close">Close</button>
            </template>
        </SharedDrawer>
    </div>
</template>
