<script lang="ts" setup></script>

<template>
    <div class="w-full h-screen flex flex-col overflow-hidden">
        <SharedToastContainer />
        <div class="fixed top-0 z-50 w-full">
            <LandingHeader />
        </div>
        <div class="w-full flex-1 overflow-x-hidden overflow-y-auto mt-[90px]">
            <slot name="default" />
        </div>
    </div>
</template>
