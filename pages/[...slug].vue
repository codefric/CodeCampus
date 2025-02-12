<script setup lang="ts">
// const { path } = useRoute();

useSeoMeta({
    title: 'Documentation',
    description: 'Project documentation',
});

definePageMeta({
    layout: 'docs',
});
</script>

<template>
    <main class="container mx-auto px-4 py-8">
        <ContentDoc class="prose dark:prose-invert max-w-none">
            <template #not-found>
                <h1>Document not found</h1>
            </template>
        </ContentDoc>
    </main>
</template>
