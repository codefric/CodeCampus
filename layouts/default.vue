<script lang="ts" setup></script>

<template>
    <div class="w-full">
        <SharedToastContainer />
        <div class="sticky top-0 z-50">
            <LandingHeader />
        </div>
        <div class="w-full overflow-x-hidden overflow-y-auto">
            <slot name="default" />
        </div>
    </div>
</template>
