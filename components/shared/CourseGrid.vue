<script setup lang="ts">
import type { Course } from '~/types/feature-card';

defineProps<{ courses: Course[]; instructor?: boolean }>();
</script>

<!-- eslint-disable vue/html-self-closing -->
<template>
    <div class="container">
        <div class="max-w-full mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    v-for="course in courses"
                    :key="course.id"
                    class="bg-white rounded-2xl p-3 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <!-- Course Image -->
                    <div class="h-64 overflow-hidden rounded-2xl">
                        <img
                            :src="course.image"
                            :alt="course.title"
                            class="w-full h-full object-cover rounded-2xl"
                        />
                    </div>

                    <div
                        v-if="!instructor"
                        class="flex items-center justify-between mt-1"
                    >
                        <div class="bg-white py-1 px-2 rounded-tr-md">
                            <p class="font-[Nunito] text-base font-semibold text-[#F4197D]">{{ course.price }}</p>
                        </div>
                        <div class="bg-white py-1 px-2 rounded-tl-md flex items-center gap-1">
                            <p class="font-[Nunito] text-xs font-normal text-[#3B2A56]">
                                {{ course.rating }} ({{ course.reviewCount }} reviews)
                            </p>
                        </div>
                    </div>

                    <!-- Course Info -->
                    <div class="p-4">
                        <h3 class="font-[Nunito] font-semibold text-lg text-[#3B2A56] line-clamp-2 text-left">{{ course.title }}</h3>
                        <!-- Divider -->

                        <p
                            v-if="instructor"
                            class="font-nunito text-sm font-light normal-case text-[#869199] mt-3"
                        >
                            Break into a new field like format technology or data science get started.
                        </p>
                        <div
                            v-if="!instructor"
                            class="border-t border-dashed border-[#3A2A56] my-3"
                        ></div>

                        <!-- Course Meta -->
                        <div
                            v-if="!instructor"
                            class="flex items-center justify-between"
                        >
                            <div class="flex items-center font-[Nunito] text-[10px] gap-1 font-normal text-[#3B2A56]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="70.236 2684.528 12.236 12.515"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M72.858 2693.468H71.11v2.682h1.748v-2.682Zm4.37-3.576H75.48v6.258h1.748v-6.258Zm4.37-4.47v10.728h-1.747v-10.728h1.748Zm-1.747-.894a.888.888 0 0 0-.874.894v10.728c0 .49.394.893.874.893h1.748c.48 0 .874-.403.874-.893v-10.728a.888.888 0 0 0-.874-.894H79.85Zm-5.245 5.364c0-.49.395-.894.874-.894h1.748a.89.89 0 0 1 .875.894v6.258c0 .49-.395.893-.875.893H75.48a.888.888 0 0 1-.874-.893v-6.258Zm-4.37 3.576c0-.49.395-.894.874-.894h1.748c.48 0 .874.403.874.894v2.682c0 .49-.394.893-.874.893H71.11a.888.888 0 0 1-.874-.893v-2.682Z"
                                        fill="#F4197D"
                                    />
                                </svg>
                                {{ course.level }}
                            </div>

                            <div class="flex items-center font-[Nunito] text-[10px] gap-1 font-normal text-[#3B2A56]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 72 72"
                                >
                                    <path
                                        d="M51 12v48H18a5.839 5.839 0 0 1-2.332-.469 6.06 6.06 0 0 1-3.2-3.199A5.839 5.839 0 0 1 12 54V18c0-.766.168-1.512.504-2.238a6.627 6.627 0 0 1 1.336-1.922c.555-.555 1.191-1 1.91-1.336A5.254 5.254 0 0 1 18 12h33Zm-3 39H18c-.422 0-.812.078-1.172.234a3.049 3.049 0 0 0-1.594 1.594c-.156.36-.234.75-.234 1.172 0 .422.078.812.234 1.172a3.049 3.049 0 0 0 1.594 1.594c.36.156.75.234 1.172.234h30v-6Zm-33-2.203A5.99 5.99 0 0 1 18 48h30V15H18c-.36 0-.719.09-1.078.27a3.672 3.672 0 0 0-1.652 1.652c-.18.36-.27.719-.27 1.078v30.797ZM21 21h21v9H21v-9Zm3 6h15v-3H24v3Z"
                                        fill="#FFC224"
                                        fill-rule="evenodd"
                                    />
                                </svg>
                                {{ course.lessonCount }} Lessons
                            </div>

                            <div class="flex items-center font-[Nunito] text-[10px] gap-1 font-normal text-[#3B2A56]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12.236 12.515"
                                >
                                    <path
                                        d="M12.237 6.23c.015 3.432-2.735 6.27-6.091 6.285-3.377.015-6.16-2.831-6.146-6.285.015-3.433 2.79-6.245 6.146-6.23 3.336.015 6.076 2.818 6.09 6.23Zm-6.118-3.52a.389.389 0 0 0-.385-.39.389.389 0 0 0-.38.39v4.302c0 .14.073.27.192.34l2.677 1.564a.38.38 0 0 0 .518-.158.398.398 0 0 0-.139-.521l-2.483-1.452v-4.075Z"
                                        fill="#687EFF"
                                    />
                                </svg>
                                {{ course.duration }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
