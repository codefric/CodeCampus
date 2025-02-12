<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first());

useSeoMeta({
    title: home.value?.title,
    description: home.value?.description,
});

const toast = useToast();

// Examples of usage:
const showSuccessToast = () => {
    toast.success('Operation completed successfully!');
};

const showErrorToast = () => {
    toast.error('Something went wrong', { timeout: 10000 }); // 10 seconds
};

const showPersistentWarning = () => {
    toast.warning('Please save your changes', { timeout: 100000 }); // Won't auto-dismiss
    // Later you can manually remove it:
    // toast.remove(id);
};
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
    </div>
</template>
