<script setup lang="ts">
const navItems = [
    { label: 'Home', path: '/docs' },
    { label: 'API', path: '/docs/api' },
    { label: 'Architecture', path: '/docs/architecture' },
    { label: 'Deployment', path: '/docs/deployment' },
    { label: 'Development', path: '/docs/development' },
    { label: 'Features', path: '/docs/features' },
];

// Add state for sidebar collapse
const isSidebarOpen = ref(true);

// Toggle sidebar function
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
    <div class="min-h-screen">
        <!-- Fixed sidebar -->
        <nav
            class="fixed left-0 top-0 h-full transition-all duration-300 border-r border-gray-200 bg-gray-50"
            :class="isSidebarOpen ? 'w-[280px]' : 'w-16'"
        >
            <div class="flex items-center justify-between p-6">
                <!-- Title only shows when sidebar is open -->
                <h1
                    class="text-2xl font-semibold text-gray-800 transition-opacity duration-300"
                    :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'"
                >
                    Documentation
                </h1>

                <!-- Toggle button -->
                <button
                    class="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
                    @click="toggleSidebar"
                >
                    <svg
                        class="w-6 h-6"
                        :class="isSidebarOpen ? 'rotate-0' : 'rotate-180'"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            <!-- Navigation items -->
            <div class="overflow-y-auto h-[calc(100vh-5rem)]">
                <ul class="space-y-2 px-4">
                    <li
                        v-for="item in navItems"
                        :key="item.path"
                    >
                        <NuxtLink
                            :to="item.path"
                            :title="item.label"
                            class="block py-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
                            :class="[isSidebarOpen ? 'px-4 text-gray-600' : 'px-2 text-center', 'active:bg-gray-200 active:text-gray-900']"
                            active-class="bg-gray-200 text-gray-900 font-medium"
                        >
                            <span :class="isSidebarOpen ? '' : 'text-sm'">
                                {{ isSidebarOpen ? item.label : item.label.charAt(0) }}
                            </span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Main content -->
        <main
            class="transition-all duration-300 min-h-screen p-8"
            :class="isSidebarOpen ? 'ml-[280px]' : 'ml-16'"
        >
            <div class="max-w-3xl mx-auto">
                <slot />
            </div>
        </main>
    </div>
</template>
