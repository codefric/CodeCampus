<script setup lang="ts">
import { coursesData } from '~/constants/courses-data';
</script>

<template>
    <div class="w-full flex flex-col gap-20 items-center justify-center mb-20">
        <div class="container bg-[rgba(245,246,249,0.72)]">
            <div class="w-full h-full ellipse-vs">
                <div class="flex items-center justify-between w-full py-16 stack-img">
                    <div class="flex w-full h-[345px] lady-img" />
                    <div class="flex flex-col gap-6 w-full ml-48">
                        <p class="font-[Nunito] text-base font-normal text-[#F4197D]">Join as Instructor</p>
                        <h2 class="font-[Nunito] text-[30px] font-bold text-[#3B2A56] mark-img move-down max-w-[302px]">
                            Become an instructor Join the millions learning
                        </h2>
                        <div>
                            <SharedBaseButton state="filled">Start Teaching Today</SharedBaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center justify-center flower-dot-img">
            <p class="font-[Nunito] text-base font-normal text-[#F4197D]">Consultancy</p>
            <h2 class="font-[Nunito] text-[30px] font-bold text-[#3B2A56] mark-img move-down h-16">Want to work on a project with us?</h2>

            <div class="w-full">
                <SharedCourseGrid
                    instructor
                    :courses="coursesData.slice(0, 4)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.stack-img {
    background-image: url(/assets//imgs/stack.png);
    background-position: 50% 70%;
    background-repeat: no-repeat;
}

.lady-img {
    background-image: url(/assets//imgs/lady.png);
    background-position: 50% 70%;
    background-repeat: no-repeat;
}

.ellipse-vs {
    background-image: url(/assets//imgs/ellipse-vs.png);
    background-position: 70% 150%;
    background-repeat: no-repeat;
}

.mark-img {
    background-image: url(/assets//imgs/mark.png);
    background-position: 100% 50%;
    background-repeat: no-repeat;
}

.move-down {
    background-position: 100% 100%;
}

.flower-dot-img {
    background-image: url(/assets//imgs/flower-dot.png);
    background-position: 110% 10%;
    background-repeat: no-repeat;
}
</style>
