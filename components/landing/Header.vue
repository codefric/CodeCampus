<script lang="ts" setup>
const navItems = ['Home', 'Consultancy', 'Courses', 'Career'];
</script>

<!-- eslint-disable vue/html-self-closing -->
<template>
    <div
        class="w-screen h-[90px] bg-white font-sans text-base font-normal text-center text-black shadow-md flex items-center justify-center"
    >
        <div class="flex items-center justify-between w-full container mx-auto">
            <div class="w-24 h-9 cursor-pointer">
                <img
                    src="/assets/imgs/logo.png"
                    alt="logo"
                />
            </div>
            <ul class="flex items-center gap-8">
                <li
                    v-for="item in navItems"
                    :key="item"
                    class="font-nunito text-base font-medium text-[#3B2A56] list-none cursor-pointer"
                >
                    {{ item }}
                </li>
            </ul>
            <div class="flex items-center gap-7">
                <SharedBaseButton state="filled"> Get Started </SharedBaseButton>
                <div class="flex items-center justify-center w-9 h-9 cursor-pointer">
                    <img
                        src="/assets/imgs/avarta.png"
                        alt="avarta"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
