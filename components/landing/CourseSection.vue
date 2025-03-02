<script lang="ts" setup>
import { coursesData } from '~/constants/courses-data';
</script>

<template>
    <div
        class="w-full font-sans text-base font-normal text-center text-black bg-[#F9F2ED] flex flex-col items-center justify-center -mt-20"
    >
        <div class="container flex items-end justify-between mt-28">
            <div class="w-[480px] flex items-start flex-col gap-5 mark-img">
                <p class="font-normal text-base text-[#F4197D]">Our Courses</p>
                <h2 class="w-[480px] font-bold text-4xl text-[#3B2A56] text-left leading-relaxed">
                    Explore Our Comprehensive Course
                    <span>
                        <button class="px-3 py-0.5 font-semibold text-4xl text-white bg-[#F4115E] rounded-full font-nunito">
                            Offerings
                        </button>
                    </span>
                </h2>
            </div>
            <div>
                <div
                    class="flex items-center justify-center w-full p-1 gap-1 font-sans text-base font-normal text-center text-black border border-opacity-60 border-[#3A2A56] rounded-full"
                >
                    <SharedBaseButton
                        rounded
                        state="filled"
                    >
                        All Categories
                    </SharedBaseButton>
                    <SharedBaseButton rounded>Programming</SharedBaseButton>
                    <SharedBaseButton rounded>Design</SharedBaseButton>
                    <SharedBaseButton rounded>AI</SharedBaseButton>
                    <SharedBaseButton rounded>Marketing</SharedBaseButton>
                </div>
            </div>
        </div>
        <div class="mb-28 mt-10">
            <SharedCourseGrid :courses="coursesData" />
        </div>
    </div>
</template>
