<script setup lang="ts">
import { ref } from 'vue';

interface Category {
    id: number;
    name: string;
    icon: any; // In a real app, you'd want to type this better
}

// Icons as components
const FundamentalsIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
            }),
        ]
    );

const FrontendIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            }),
        ]
    );

const BackendIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
            }),
        ]
    );

const FullstackIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
            }),
        ]
    );

const AndroidIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
            }),
        ]
    );

const GameIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
            }),
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            }),
        ]
    );

const IOSIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            }),
        ]
    );

const DevopsIcon = () =>
    h(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            class: 'w-6 h-6',
        },
        [
            h('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
            }),
        ]
    );

// Need to import h for creating elements
import { h } from 'vue';

const categories = ref<Category[]>([
    { id: 1, name: 'Fundamentals', icon: FundamentalsIcon },
    { id: 2, name: 'Frontend Development', icon: FrontendIcon },
    { id: 3, name: 'Backend Development', icon: BackendIcon },
    { id: 4, name: 'Fullstack Development', icon: FullstackIcon },
    { id: 5, name: 'Android Development', icon: AndroidIcon },
    { id: 6, name: 'Game Development', icon: GameIcon },
    { id: 7, name: 'iOS Development', icon: IOSIcon },
    { id: 8, name: 'Devops', icon: DevopsIcon },
]);
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div
            v-for="category in categories"
            :key="category.id"
            class="bg-gray-100 rounded-md p-4 flex items-center"
        >
            <div class="w-10 h-10 relative flex items-center justify-center mr-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="81.566 3582.625 40.212 26.75"
                >
                    <path
                        d="M92.64 3585.889c2.51-2.096 5.716-3.254 9.032-3.264 6.76 0 12.373 4.864 12.984 11.135 4 .547 7.122 3.79 7.122 7.768 0 4.367-3.765 7.847-8.326 7.847H91.069c-5.21 0-9.503-3.974-9.503-8.954 0-4.287 3.182-7.838 7.394-8.737.36-2.1 1.754-4.19 3.68-5.795Z"
                        fill="#DEECEE"
                    />
                </svg>
                <component
                    :is="category.icon"
                    class="w-6 h-6 text-[#1EA69A] absolute"
                />
            </div>
            <span class="text-gray-800 font-medium">{{ category.name }}</span>
        </div>
    </div>
</template>
