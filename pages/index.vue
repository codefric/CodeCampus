<script setup lang="ts"></script>

<template>
    <main class="flex flex-col items-center">
        <LandingHeroBanner />
        <div class="container flower-img w-full z-10 h-[778px]">
            <LandingFeatureHighlights />
        </div>
        <div class="w-full flex items-center">
            <LandingCourseSection />
        </div>
        <div class="container w-full flex items-center flower-pot-img z-10 -mt-11">
            <LandingTopCareers />
        </div>
        <LandingInstructor />
        <LandingFooter />
    </main>
</template>

<style scoped>
.mark-img {
    background-image: url(/assets//imgs/mark.png);
    background-position: 38% 112%;
    background-repeat: no-repeat;
}

.flower-img {
    background-image: url(/assets//imgs/flower.png);
    background-position: 5% 100%;
    background-repeat: no-repeat;
}
.flower-pot-img {
    background-image: url(/assets//imgs/flower-pot.png);
    background-position: 100% 1%;
    background-repeat: no-repeat;
}
</style>
