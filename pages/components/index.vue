<script setup lang="ts">
import type { DrawerPlacement, DrawerSize } from '~/store/ui';
import { useUIStore } from '~/store/ui';

const bannerId = 'my-banner';
const { show, toggle, isVisible } = useBanner(bannerId);

// Store and UI state management
const toast = useToast();
const uiStore = useUIStore();
const drawer = useDrawer('component-library-drawer');
const searchQuery = ref('');
const activeTab = ref('buttons');

// You can now use these functions anywhere in your component
const showBannerAfterAction = () => {
    // Do something
    show();
};

// Modal configurations
const modalTypes = [
    {
        id: 'small-top-modal',
        buttonText: 'Small Top Modal',
        title: 'Small Modal',
        content: 'This is a small modal that appears at the top of the screen.',
        size: 'sm',
        position: 'top',
    },
    {
        id: 'medium-modal',
        buttonText: 'Medium Modal',
        title: 'Medium Modal',
        content: 'This is a medium-sized modal that appears in the center.',
        size: 'md',
        position: 'center',
    },
    {
        id: 'large-modal',
        buttonText: 'Large Modal',
        title: 'Large Modal',
        content: 'This is a large modal perfect for complex content.',
        size: 'lg',
        position: 'center',
    },
    {
        id: 'full-modal',
        buttonText: 'Full Modal',
        title: 'Full-Width Modal',
        content: 'This modal takes up most of the screen width for maximum content display.',
        size: 'full',
        position: 'center',
    },
] as const;

// Reactive states
const activeModal = reactive({
    id: '',
    title: '',
    content: '',
    size: 'md',
    position: 'center',
} as const);

const drawerConfig = reactive({
    placement: 'right' as DrawerPlacement,
    size: 'lg' as DrawerSize,
});

// Navigation items for dropdowns
const navigationItems = [
    { label: 'Dashboard', value: 'dashboard', icon: 'ph:squares-four-bold' },
    { label: 'Profile', value: 'profile', icon: 'ph:user-circle', badge: 'New' },
    { label: 'Settings', value: 'settings', icon: 'ph:gear-six' },
    { label: 'Help Center', value: 'help', icon: 'ph:question' },
    { label: 'Logout', value: 'logout', icon: 'ph:sign-out' },
];

// Available tabs for the component library
const availableTabs = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'modals', label: 'Modals & Drawers' },
    { id: 'dropdowns', label: 'Dropdowns' },
    { id: 'inputs', label: 'Inputs' },
] as const;

const selectedValue = ref('option1');

const radioOptions = [
    {
        label: 'Option 1',
        value: 'option1',
        description: 'This is the first option',
    },
    {
        label: 'Option 2',
        value: 'option2',
        description: 'This is the second option',
        disabled: true,
    },
    {
        label: 'Option 3',
        value: 'option3',
    },
];

// Methods
const showSuccessToast = () => {
    toast.success('Operation completed successfully!');
};

const showErrorToast = () => {
    toast.error('Something went wrong', { timeout: 10000 });
};

const showPersistentWarning = () => {
    toast.warning('Please save your changes', { timeout: 100000 });
};

const openModal = (modalId: string) => {
    const modalConfig = modalTypes.find((m) => m.id === modalId);
    if (modalConfig) {
        Object.assign(activeModal, modalConfig);
        uiStore.openModal(modalId);
    }
};

const handleSelect = (item: any) => {
    alert(`Selected: ${item.label}`);
};

const handleChipClick = () => {
    alert('clicked');
};

const handleChipClose = () => {
    // Handle chip close action
    alert('Chip closed');
};

// Lifecycle hooks
onMounted(() => {
    drawer.register({
        size: drawerConfig.size,
        placement: drawerConfig.placement,
    });
});

onUnmounted(() => {
    drawer.unregister();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <div class="container mx-auto px-4 py-12 space-y-4">
            <!-- Page Header -->
            <div class="mb-12 text-center space-y-4">
                <h1 class="text-4xl font-bold mb-3 text-gray-900">Component Library</h1>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore our comprehensive collection of UI components designed for building modern web applications
                </p>
            </div>

            <!-- Tab Navigation -->
            <div class="mb-10 space-y-4">
                <div class="border-b border-gray-200 space-y-4">
                    <nav class="-mb-px flex justify-center space-x-8">
                        <SharedBaseButton
                            v-for="tab in availableTabs"
                            :key="tab.id"
                            :state="'semi-filled'"
                            :active="activeTab === tab.id"
                            @click="activeTab = tab.id"
                        >
                            {{ tab.label }}
                        </SharedBaseButton>
                    </nav>
                </div>
            </div>

            <!-- Components Display Area -->
            <div class="max-w-6xl mx-auto space-y-4">
                <!-- Buttons Section -->
                <div
                    v-show="activeTab === 'buttons'"
                    class="space-y-8"
                >
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-4">
                        <div class="max-w-3xl mx-auto space-y-4">
                            <h2 class="text-2xl font-semibold mb-2">Button Variants</h2>
                            <p class="text-gray-600 mb-8">
                                Explore the various button styles and states available in our component library.
                            </p>

                            <div class="space-y-12">
                                <!-- Filled Buttons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Filled Buttons</h3>
                                    <p class="text-gray-600 mb-4">Primary action buttons with solid background colors.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton
                                            state="filled"
                                            class="transition-transform hover:scale-105"
                                        >
                                            Primary Button
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="filled"
                                            error
                                        >
                                            Error State
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="filled"
                                            disabled
                                        >
                                            Disabled
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <!-- Outline Buttons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Outline Buttons</h3>
                                    <p class="text-gray-600 mb-4">Secondary action buttons with bordered style.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton state="outline"> Outline Button </SharedBaseButton>
                                        <SharedBaseButton
                                            state="outline"
                                            error
                                        >
                                            Error Outline
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="outline"
                                            disabled
                                        >
                                            Disabled Outline
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <!-- Semi-filled Buttons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Semi-filled Buttons</h3>
                                    <p class="text-gray-600 mb-4">Hybrid style combining filled and outline properties.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton state="semi-filled"> Semi-filled </SharedBaseButton>
                                        <SharedBaseButton
                                            state="semi-filled"
                                            error
                                        >
                                            Error Semi-filled
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="semi-filled"
                                            disabled
                                        >
                                            Disabled Semi-filled
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <!-- Icon Buttons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Icon Buttons</h3>
                                    <p class="text-gray-600 mb-4">Buttons with leading or trailing icons for enhanced visual cues.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton
                                            state="filled"
                                            variant="leading-icon"
                                        >
                                            <template #leading-icon>
                                                <Icon
                                                    name="ph:plus"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                            Add Item
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="outline"
                                            variant="trailing-icon"
                                            @click="showBannerAfterAction"
                                        >
                                            View More
                                            <template #trailing-icon>
                                                <Icon
                                                    name="ph:arrow-right"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="semi-filled"
                                            variant="both-icons"
                                        >
                                            <template #leading-icon>
                                                <Icon
                                                    name="ph:gear"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                            Settings
                                            <template #trailing-icon>
                                                <Icon
                                                    name="ph:caret-down"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <!-- Toast Notification Buttons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Toast Notifications</h3>
                                    <p class="text-gray-600 mb-4">Buttons that trigger different types of toast notifications.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton
                                            state="filled"
                                            @click="showSuccessToast"
                                        >
                                            Show Success
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="filled"
                                            error
                                            @click="showErrorToast"
                                        >
                                            Show Error
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="filled"
                                            variant="leading-icon"
                                            @click="showPersistentWarning"
                                        >
                                            <template #leading-icon>
                                                <Icon
                                                    name="ph:warning"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                            Show Warning
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <div class="space-y-4">
                                    <SharedBaseBanner
                                        :id="bannerId"
                                        type="info"
                                    >
                                        <template #title> Important Notice </template>
                                        This is an important message that can be collapsed or dismissed.
                                    </SharedBaseBanner>

                                    <!-- Example controls -->
                                    <div class="space-x-4">
                                        <SharedBaseButton
                                            v-if="!isVisible"
                                            state="filled"
                                            @click="show"
                                        >
                                            Show Banner
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="outline"
                                            @click="toggle"
                                        >
                                            Toggle Banner
                                        </SharedBaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modals Section -->
                <div
                    v-show="activeTab === 'modals'"
                    class="space-y-8"
                >
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-4">
                        <div class="max-w-3xl mx-auto space-y-4">
                            <h2 class="text-2xl font-semibold mb-2">Modals & Drawers</h2>
                            <p class="text-gray-600 mb-8">Various modal dialogs and drawer components for different use cases.</p>

                            <div class="space-y-12">
                                <!-- Modal Variants -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Modal Variants</h3>
                                    <p class="text-gray-600 mb-4">Different sizes and positions for modal dialogs.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton
                                            v-for="modalType in modalTypes"
                                            :key="modalType.id"
                                            state="semi-filled"
                                            class="transition-transform hover:scale-105"
                                            @click="openModal(modalType.id)"
                                        >
                                            {{ modalType.buttonText }}
                                        </SharedBaseButton>
                                    </div>
                                </section>

                                <!-- Drawer Variants -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Drawer</h3>
                                    <p class="text-gray-600 mb-4">Side panel that slides in from the edge of the screen.</p>
                                    <div class="flex flex-wrap gap-4">
                                        <SharedBaseButton
                                            state="semi-filled"
                                            class="transition-transform hover:scale-105"
                                            @click="drawer.toggle"
                                        >
                                            Toggle Drawer
                                        </SharedBaseButton>
                                    </div>
                                </section>
                            </div>

                            <!-- Modal Components -->
                            <SharedBaseModal
                                :modal-id="activeModal.id"
                                :title="activeModal.title"
                                :size="activeModal.size"
                                :position="activeModal.position"
                            >
                                <p>{{ activeModal.content }}</p>
                            </SharedBaseModal>

                            <!-- Drawer Component -->
                            <SharedDrawer
                                v-model:is-open="drawer.isOpen.value"
                                :placement="drawerConfig.placement"
                                :size="drawerConfig.size"
                                @close="drawer.close"
                            >
                                <template #header>
                                    <h2 class="text-xl font-semibold">Drawer Example</h2>
                                </template>
                                <div class="p-4">
                                    <p class="text-gray-600">
                                        This is a drawer component that can be used to show supplementary content. It can be configured to
                                        appear from different sides of the screen.
                                    </p>
                                    <div class="mt-4 space-y-4">
                                        <SharedBaseInput
                                            v-model="searchQuery"
                                            placeholder="Example input in drawer..."
                                        />
                                        <p class="text-sm text-gray-500">Try resizing the window to see how the drawer responds.</p>
                                    </div>
                                </div>
                                <template #footer>
                                    <div class="flex justify-end space-x-4">
                                        <SharedBaseButton
                                            state="outline"
                                            @click="drawer.close"
                                        >
                                            Cancel
                                        </SharedBaseButton>
                                        <SharedBaseButton
                                            state="filled"
                                            @click="drawer.close"
                                        >
                                            Confirm
                                        </SharedBaseButton>
                                    </div>
                                </template>
                            </SharedDrawer>
                        </div>
                    </div>
                </div>

                <!-- Dropdowns Section -->
                <div
                    v-show="activeTab === 'dropdowns'"
                    class="space-y-8"
                >
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-4">
                        <div class="max-w-3xl mx-auto space-y-4">
                            <h2 class="text-2xl font-semibold mb-2">Dropdown Menus</h2>
                            <p class="text-gray-600 mb-8">Customizable dropdown components for various use cases.</p>

                            <div class="space-y-12">
                                <!-- Basic Dropdown -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Basic Dropdown</h3>
                                    <p class="text-gray-600 mb-4">Simple dropdown menu with default styling.</p>
                                    <div class="w-[400px] space-y-4">
                                        <SharedBaseDropdown
                                            button-state="semi-filled"
                                            label="Select Option"
                                            :items="navigationItems"
                                            @select="handleSelect"
                                        >
                                            <template #trigger-icon>
                                                <Icon
                                                    name="ph:caret-down"
                                                    class="w-5 h-5"
                                                />
                                            </template>
                                        </SharedBaseDropdown>

                                        <SharedBaseDropdown
                                            button-state="outline"
                                            label="Disabled Dropdown"
                                            :items="navigationItems"
                                            disabled
                                        />

                                        <SharedBaseDropdown
                                            button-state="filled"
                                            label="Error State"
                                            :items="navigationItems"
                                            error
                                        />
                                    </div>
                                </section>

                                <!-- Custom Styled Dropdown -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Custom Styled Dropdown</h3>
                                    <p class="text-gray-600 mb-4">Dropdown with custom item rendering and badges.</p>
                                    <div class="w-[400px]">
                                        <SharedBaseDropdown
                                            label="Custom Items"
                                            :items="navigationItems"
                                            button-state="filled"
                                        >
                                            <template #item="{ item, select }">
                                                <SharedBaseButton
                                                    state="default"
                                                    variant="leading-icon"
                                                    class="w-full !justify-start rounded-none hover:bg-gray-50"
                                                    @click="select"
                                                >
                                                    <template #leading-icon>
                                                        <Icon
                                                            :name="item.icon"
                                                            class="w-5 h-5"
                                                        />
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
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inputs Section -->
                <div
                    v-show="activeTab === 'inputs'"
                    class="space-y-8"
                >
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-4">
                        <div class="max-w-3xl mx-auto space-y-4">
                            <h2 class="text-2xl font-semibold mb-2">Input Fields</h2>
                            <p class="text-gray-600 mb-8">Various input field types and states for form construction.</p>

                            <div class="space-y-12">
                                <!-- Basic Inputs -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Basic Inputs</h3>
                                    <p class="text-gray-600 mb-4">Standard text input fields with different states.</p>
                                    <div class="space-y-4">
                                        <SharedBaseInput
                                            v-model="searchQuery"
                                            placeholder="Default input"
                                        />
                                        <SharedBaseInput
                                            v-model="searchQuery"
                                            placeholder="Disabled input"
                                            disabled
                                        />
                                    </div>
                                </section>

                                <!-- Input with Icons -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Inputs with Icons</h3>
                                    <p class="text-gray-600 mb-4">Input fields with leading and trailing icons.</p>
                                    <div class="space-y-4">
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
                                    </div>
                                </section>

                                <!-- Input States -->
                                <section class="space-y-4">
                                    <h3 class="text-lg font-medium text-gray-900">Input States</h3>
                                    <p class="text-gray-600 mb-4">Different validation states for input fields.</p>
                                    <div class="space-y-4">
                                        <SharedBaseInput
                                            v-model="searchQuery"
                                            state="error"
                                            placeholder="Error state"
                                        >
                                            <template #suffix-icon="{ size }">
                                                <Icon
                                                    name="ph:warning"
                                                    class="text-red-500"
                                                    :class="size"
                                                />
                                            </template>
                                        </SharedBaseInput>

                                        <SharedBaseInput
                                            v-model="searchQuery"
                                            state="success"
                                            placeholder="Success state"
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

                                    <div class="space-y-8">
                                        <!-- Basic Radio Group -->
                                        <div>
                                            <h3 class="text-lg font-medium mb-4">Basic Radio Group</h3>
                                            <SharedBaseRadioGroup
                                                v-model="selectedValue"
                                                :options="radioOptions"
                                                name="basic-group"
                                            />
                                        </div>

                                        <!-- Horizontal Radio Group -->
                                        <div>
                                            <h3 class="text-lg font-medium mb-4">Horizontal Layout</h3>
                                            <SharedBaseRadioGroup
                                                v-model="selectedValue"
                                                :options="radioOptions"
                                                orientation="horizontal"
                                                name="horizontal-group"
                                            />
                                        </div>

                                        <!-- Different Sizes -->
                                        <div>
                                            <h3 class="text-lg font-medium mb-4">Sizes</h3>
                                            <div class="space-y-6">
                                                <SharedBaseRadioGroup
                                                    v-model="selectedValue"
                                                    :options="radioOptions"
                                                    size="sm"
                                                    name="small-group"
                                                />
                                                <SharedBaseRadioGroup
                                                    v-model="selectedValue"
                                                    :options="radioOptions"
                                                    size="md"
                                                    name="medium-group"
                                                />
                                                <SharedBaseRadioGroup
                                                    v-model="selectedValue"
                                                    :options="radioOptions"
                                                    size="lg"
                                                    name="large-group"
                                                />
                                            </div>
                                        </div>

                                        <!-- Error State -->
                                        <div>
                                            <h3 class="text-lg font-medium mb-4">Error State</h3>
                                            <SharedBaseRadioGroup
                                                v-model="selectedValue"
                                                :options="radioOptions"
                                                error
                                                name="error-group"
                                            />
                                        </div>
                                    </div>

                                    <div class="space-y-8">
                                        <!-- Basic Chips -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">Basic Chips</h3>
                                            <div class="flex flex-wrap gap-2">
                                                <SharedBaseChip label="Default" />
                                                <SharedBaseChip
                                                    label="Primary"
                                                    color="primary"
                                                />
                                                <SharedBaseChip
                                                    label="Success"
                                                    color="success"
                                                />
                                                <SharedBaseChip
                                                    label="Warning"
                                                    color="warning"
                                                />
                                                <SharedBaseChip
                                                    label="Error"
                                                    color="error"
                                                />
                                                <SharedBaseChip
                                                    label="Info"
                                                    color="info"
                                                />
                                            </div>
                                        </div>

                                        <!-- Variants -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">Variants</h3>
                                            <div class="flex flex-wrap gap-2">
                                                <SharedBaseChip
                                                    label="Solid"
                                                    color="primary"
                                                    variant="solid"
                                                />
                                                <SharedBaseChip
                                                    label="Outline"
                                                    color="primary"
                                                    variant="outline"
                                                />
                                                <SharedBaseChip
                                                    label="Soft"
                                                    color="primary"
                                                    variant="soft"
                                                />
                                            </div>
                                        </div>

                                        <!-- Sizes -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">Sizes</h3>
                                            <div class="flex flex-wrap gap-2 items-center">
                                                <SharedBaseChip
                                                    label="Small"
                                                    color="primary"
                                                    size="sm"
                                                />
                                                <SharedBaseChip
                                                    label="Medium"
                                                    color="primary"
                                                    size="md"
                                                />
                                                <SharedBaseChip
                                                    label="Large"
                                                    color="primary"
                                                    size="lg"
                                                />
                                            </div>
                                        </div>

                                        <!-- With Icons -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">With Icons</h3>
                                            <div class="flex flex-wrap gap-2">
                                                <SharedBaseChip
                                                    label="Profile"
                                                    color="primary"
                                                    icon="ph:user"
                                                />
                                                <SharedBaseChip
                                                    label="Settings"
                                                    color="info"
                                                    icon="ph:gear"
                                                />
                                                <SharedBaseChip
                                                    label="Success"
                                                    color="success"
                                                    icon="ph:check"
                                                />
                                            </div>
                                        </div>

                                        <!-- Interactive Chips -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">Interactive Chips</h3>
                                            <div class="flex flex-wrap gap-2">
                                                <SharedBaseChip
                                                    label="Clickable"
                                                    color="primary"
                                                    clickable
                                                    @click="handleChipClick"
                                                />
                                                <SharedBaseChip
                                                    label="Closeable"
                                                    color="error"
                                                    closeable
                                                    @close="handleChipClose"
                                                />
                                                <SharedBaseChip
                                                    label="Active"
                                                    color="success"
                                                    active
                                                    clickable
                                                />
                                                <SharedBaseChip
                                                    label="Disabled"
                                                    color="warning"
                                                    disabled
                                                    clickable
                                                />
                                            </div>
                                        </div>

                                        <!-- Combined Features -->
                                        <div class="space-y-4">
                                            <h3 class="text-lg font-medium">Combined Features</h3>
                                            <div class="flex flex-wrap gap-2">
                                                <SharedBaseChip
                                                    label="Full Featured"
                                                    color="primary"
                                                    icon="ph:star"
                                                    clickable
                                                    closeable
                                                    @click="handleChipClick"
                                                    @close="handleChipClose"
                                                />
                                                <SharedBaseChip
                                                    label="Active & Closeable"
                                                    color="success"
                                                    active
                                                    closeable
                                                    @close="handleChipClose"
                                                />
                                                <SharedBaseChip
                                                    label="Icon & Outline"
                                                    color="info"
                                                    variant="outline"
                                                    icon="ph:info"
                                                    clickable
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
