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

const items = [
    { label: 'Dashboard', value: 'dashboard', icon: 'ph:squares-four-bold' },
    { label: 'Profile', value: 'profile', icon: 'ph:user-circle', badge: 'New' },
    { label: 'Settings', value: 'settings', icon: 'ph:gear-six' },
    { label: 'Help Center', value: 'help', icon: 'ph:question' },
    { label: 'Logout', value: 'logout', icon: 'ph:sign-out' },
];

const handleSelect = (item: any) => {
    // Handle item selection
    alert(`Selected: ${item.label}`);
};

const searchQuery = ref('');
</script>

<template>
    <ContentRenderer
        v-if="home"
        :value="home"
    />
    <div
        v-else
        class="flex flex-col items-center gap-4"
    >
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            @click="showSuccessToast"
        >
            showSuccessToast
        </button>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            @click="showErrorToast"
        >
            showErrorToast
        </button>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            @click="showPersistentWarning"
        >
            showPersistentWarning
        </button>

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

        <!-- Filled button (default) -->
        <SharedBaseButton
            variant="leading-icon"
            state="filled"
        >
            <template #leading-icon>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                >
                    <path
                        d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                        stroke="#079455"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </template>
            Submit
        </SharedBaseButton>

        <!-- Filled button with error -->
        <SharedBaseButton
            state="filled"
            error
        >
            Error State
        </SharedBaseButton>

        <!-- Semi-filled button with icons -->
        <SharedBaseButton
            state="semi-filled"
            variant="both-icons"
        >
            <template #leading-icon>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                >
                    <path
                        d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                        stroke="#079455"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </template>
            Search
            <template #trailing-icon>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                >
                    <path
                        d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                        stroke="#079455"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </template>
        </SharedBaseButton>

        <!-- Outline button disabled -->
        <SharedBaseButton
            state="outline"
            disabled
        >
            Disabled Outline
        </SharedBaseButton>

        <!-- Default style -->
        <SharedBaseButton state="default"> Cancel </SharedBaseButton>

        <div>
            <div class="w-[400px]">
                <!-- Basic usage -->
                <SharedBaseDropdown
                    button-state="semi-filled"
                    label="Select Option"
                    :items="items"
                    @select="handleSelect"
                >
                    <template #trigger-icon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                        >
                            <path
                                d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                                stroke="#079455"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </template>
                </SharedBaseDropdown>
            </div>

            <!-- Custom item styling -->
            <SharedBaseDropdown
                label="Custom Items"
                :items="items"
                button-state="filled"
            >
                <template #trigger-icon>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                    >
                        <path
                            d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                            stroke="#079455"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </template>

                <template #item="{ item, select }">
                    <SharedBaseButton
                        state="default"
                        variant="leading-icon"
                        class="w-full !justify-start rounded-none hover:bg-gray-50"
                        @click="select"
                    >
                        <template #leading-icon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                            >
                                <path
                                    d="M8.00033 3.4165V2.1665M4.71754 4.71705L3.83366 3.83317M4.71754 11.3332L3.83366 12.2171M11.3337 4.71705L12.2175 3.83317M3.41699 7.99984H2.16699M13.7207 13.9911L11.6443 17.8474C11.4071 18.2879 11.2884 18.5082 11.1457 18.5639C11.0219 18.6122 10.8824 18.5986 10.7703 18.5271C10.6411 18.4448 10.5675 18.2057 10.4202 17.7276L7.53798 8.37088C7.41766 7.98026 7.3575 7.78495 7.4059 7.65303C7.44807 7.53813 7.53862 7.44758 7.65352 7.40542C7.78544 7.35701 7.98075 7.41717 8.37137 7.5375L17.728 10.4197C18.2062 10.567 18.4453 10.6407 18.5276 10.7699C18.599 10.882 18.6127 11.0214 18.5643 11.1453C18.5086 11.288 18.2884 11.4066 17.8478 11.6438L13.9916 13.7202C13.9262 13.7555 13.8934 13.7731 13.8648 13.7958C13.8394 13.8159 13.8163 13.8389 13.7962 13.8643C13.7736 13.893 13.756 13.9257 13.7207 13.9911Z"
                                    stroke="#079455"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </template>
                        {{ item.label }}
                        <template
                            v-if="item.badge"
                            #trailing-icon
                        >
                            <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {{ item.badge }}
                            </span>
                        </template>
                    </SharedBaseButton>
                </template>
            </SharedBaseDropdown>
        </div>

        <div>
            <!-- Basic input -->
            <SharedBaseInput
                v-model="searchQuery"
                placeholder="Enter text..."
            />

            <!-- With icons -->
            <SharedBaseInput
                v-model="searchQuery"
                placeholder="Search..."
                clearable
            >
                <template #prefix-icon="{ size }">
                    <Icon
                        name="ph:magnifying-glass"
                        :class="size"
                    />
                </template>
            </SharedBaseInput>

            <!-- Password input -->
            <SharedBaseInput
                v-model="searchQuery"
                type="password"
                placeholder="Enter password"
            >
                <template #prefix-icon="{ size }">
                    <Icon
                        name="ph:lock"
                        :class="size"
                    />
                </template>
            </SharedBaseInput>

            <!-- Error state -->
            <SharedBaseInput
                v-model="searchQuery"
                type="email"
                state="error"
                placeholder="Enter email"
            >
                <template #prefix-icon="{ size }">
                    <Icon
                        name="ph:envelope"
                        :class="size"
                    />
                </template>
                <template #suffix-icon="{ size }">
                    <Icon
                        name="ph:warning"
                        class="text-red-500"
                        :class="size"
                    />
                </template>
            </SharedBaseInput>

            <!-- Success state -->
            <SharedBaseInput
                v-model="searchQuery"
                state="success"
                placeholder="Username"
            >
                <template #suffix-icon="{ size }">
                    <Icon
                        name="ph:check"
                        class="text-green-500"
                        :class="size"
                    />
                </template>
            </SharedBaseInput>
        </div>
    </div>
</template>
