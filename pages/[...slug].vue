<script setup lang="ts">
// const { path } = useRoute();

useSeoMeta({
    title: 'Documentation',
    description: 'Project documentation'
});
</script>

<template>
    <article class="max-w-4xl mx-auto px-4 py-8">
        <ContentDoc 
            class="prose prose-slate lg:prose-lg dark:prose-invert"
        />
    </article>
</template>