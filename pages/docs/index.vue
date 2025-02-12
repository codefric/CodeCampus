<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/docs').first());

useSeoMeta({
    title: home.value?.title,
    description: home.value?.description,
});
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <ContentRenderer
            v-if="home"
            :value="home"
            class="prose prose-sm sm:prose lg:prose-lg"
        />
        <div
            v-else
            class="text-center text-red-500"
        >
            Home not found
        </div>
    </div>
</template>
