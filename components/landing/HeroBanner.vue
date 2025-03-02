<script lang="ts" setup></script>

<template>
    <div class="h-[min(calc(100vh),1020px)] flex flex-col items-center overflow-x-hidden w-screen">
        <div class="hero-banner w-full h-full flex flex-col justify-between items-center container mx-auto">
            <div class="w-full h-full flex flex-col items-center">
                <div class="lamp-img w-full flex flex-col items-center h-[80%]">
                    <div class="books-img w-full h-full flex flex-col items-center">
                        <div class="stack-img w-full h-full flex flex-col items-center">
                            <div class="flex flex-col w-full h-full justify-center hero-img">
                                <div class="flex flex-col gap-4 mark-img">
                                    <div class="w-[652px] font-nunito text-[55px] font-extrabold text-[#3B2A56]">
                                        <h1>
                                            <span class="text-[#1EA69A]">5500+</span> Courses Upgrade your learning Skills and Upgrade Life
                                        </h1>
                                    </div>
                                    <p class="w-[562px] h-16 font-nunito text-lg font-normal text-[#7A7384]">
                                        Learn 100% online with world class universities and industry experts.
                                    </p>
                                    <div class="flex items-center gap-2 w-[562px]">
                                        <SharedBaseInput
                                            class="w-full"
                                            placeholder="Search our 12,500+ courses"
                                        >
                                            <template #prefix-icon="{ size }">
                                                <div :class="size">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="56.806 583.788 15.219 14.745"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <defs>
                                                            <path
                                                                id="a"
                                                                d="M67.17 589.819c0 2.212-1.857 4.01-4.14 4.01-2.282 0-4.154-1.798-4.154-4.01 0-2.227 1.856-4.026 4.154-4.026 2.283 0 4.14 1.814 4.14 4.026Zm.99 3.406a5.84 5.84 0 0 0 1.095-3.406c0-3.333-2.785-6.031-6.225-6.031-3.439 0-6.224 2.698-6.224 6.03 0 3.333 2.785 6.032 6.224 6.032a6.507 6.507 0 0 0 3.531-1.062l3.866 3.745 1.598-1.548-3.866-3.76Z"
                                                            />
                                                        </defs>
                                                        <use
                                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                                            xlink:href="#a"
                                                            fill="#3B2A56"
                                                            style="mix-blend-mode: normal"
                                                        />
                                                    </svg>
                                                </div>
                                            </template>
                                        </SharedBaseInput>
                                        <SharedBaseButton state="filled"> Search Now </SharedBaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full flex -ml-28">
                    <div class="w-[596px] h-14 font-arial text-base font-normal text-center text-black bg-[#3A2A56] rounded-r-full">
                        <div class="flex w-full items-center h-full ml-12">
                            <p class="font-nunito text-3xl font-normal text-white text-center">
                                522,8910 <span class="text-base">people are learning on FiStudy today.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <SharedPartnerScroller />
        </div>
    </div>
</template>

<style scoped>
.hero-banner {
    /* background-color: #f4f8f6; */
    background-image: url(/assets//imgs/ellipse.png);
    background-position: 80% 30%;
    background-repeat: no-repeat;
}

.hero-img {
    background-image: url(/assets//imgs/hero.png);
    background-position: 100% 65%;
    background-repeat: no-repeat;
}

.lamp-img {
    background-image: url(/assets//imgs/lamp.png);
    background-position: center 0%;
    background-repeat: no-repeat;
}

.books-img {
    background-image: url(/assets//imgs/books.png);
    background-position: 40% 90%;
    background-repeat: no-repeat;
}

.stack-img {
    background-image: url(/assets//imgs/stack.png);
    background-position: 50% 70%;
    background-repeat: no-repeat;
}

.mark-img {
    background-image: url(/assets//imgs/mark.png);
    background-position: 42% 45%;
    background-repeat: no-repeat;
}
</style>
