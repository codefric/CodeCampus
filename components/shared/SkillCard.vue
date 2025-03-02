<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    title?: string;
    description?: string;
    icon?: string;
    iconBackgroundColor?: string;
    fullWidth?: boolean;
}>();
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
    <div
        class="flex flex-col items-center text-center p-5 rounded-lg bg-white shadow-sm w-[200px] max-w-xs mx-auto"
        :class="{ 'max-w-full': props.fullWidth }"
    >
        <div
            class="flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            :style="{ backgroundColor: props.iconBackgroundColor }"
        >
            <slot name="icon">
                <div
                    v-if="props.icon"
                    v-html="props.icon"
                />
            </slot>
        </div>
        <h2
            v-if="props.title"
            class="font-nunito text-base font-normal text-center normal-case text-[#3B2A56] mb-2"
        >
            {{ props.title }}
        </h2>
        <p
            v-if="props.description"
            class="font-nunito text-sm font-light text-center normal-case text-[#869199]"
        >
            {{ props.description }}
        </p>
        <slot />
    </div>
</template>
