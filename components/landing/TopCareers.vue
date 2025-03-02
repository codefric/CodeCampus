<script setup lang="ts">
const items = ['Remote learning & self development', 'Lifetime access with expert trainers'];

const homeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
</svg>`;

const settingIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="24" height="24" fill="#F4197D">
    <path d="M53.79 35.156c0 .14.003.281.01.422a7.604 7.604 0 0 1 0 .844 8.46 8.46 0 0 0-.01.422l6.07 3.773-3.727 8.977L49.172 48c-.375.406-.766.797-1.172 1.172l1.594 6.96-8.977 3.727-3.773-6.07c-.14 0-.281.004-.422.012a7.604 7.604 0 0 1-.844 0 7.604 7.604 0 0 0-.422-.012l-3.773 6.07-8.977-3.726L24 49.172A20.724 20.724 0 0 1 22.828 48l-6.96 1.594-3.727-8.977 6.07-3.773c0-.14-.004-.281-.012-.422a7.604 7.604 0 0 1 0-.844c.008-.14.012-.281.012-.422l-6.07-3.773 3.726-8.977L22.828 24c.375-.406.766-.797 1.172-1.172l-1.594-6.96 8.977-3.727 3.773 6.07c.14 0 .281-.004.422-.012a7.604 7.604 0 0 1 .844 0c.14.008.281.012.422.012l3.773-6.07 8.977 3.726L48 22.828c.406.375.797.766 1.172 1.172l6.96-1.594 3.727 8.977-6.07 3.773Zm-2.743 3.047c.031-.375.062-.746.094-1.113a13.123 13.123 0 0 0 0-2.215l-.094-1.102 5.531-3.445-2.016-4.875-6.351 1.477c-.484-.594-.98-1.14-1.488-1.64s-1.059-1-1.653-1.5l1.477-6.352-4.875-2.016-3.469 5.531-1.101-.094a13.265 13.265 0 0 0-2.215 0c-.367.032-.739.063-1.114.094l-3.445-5.531-4.875 2.015 1.477 6.352c-.594.484-1.14.98-1.64 1.488s-1 1.059-1.5 1.653l-6.352-1.477-2.016 4.875 5.531 3.469c-.031.375-.062.746-.094 1.113a13.123 13.123 0 0 0 0-2.215l.094 1.102-5.531 3.445 2.015 4.875 6.352-1.477c.484.594.98 1.14 1.488 1.64s1.059 1 1.653 1.5l-1.477 6.352 4.875 2.016 3.469-5.531 1.101.094a13.265 13.265 0 0 0 2.215 0c.367-.032.739-.063 1.114-.094l3.445 5.531 4.875-2.016-1.477-6.351c.594-.484 1.14-.98 1.64-1.488s1-1.059 1.5-1.653l6.352 1.477 2.016-4.875-5.531-3.469ZM36 27.187a8.59 8.59 0 0 1 3.434.692 8.892 8.892 0 0 1 2.8 1.887 8.892 8.892 0 0 1 1.887 2.8A8.586 8.586 0 0 1 44.812 36c0 1.219-.23 2.363-.69 3.434a8.892 8.892 0 0 1-1.888 2.8 8.892 8.892 0 0 1-2.8 1.887 8.588 8.588 0 0 1-3.434.691 8.588 8.588 0 0 1-3.434-.69 8.892 8.892 0 0 1-2.8-1.888 8.892 8.892 0 0 1-1.887-2.8A8.588 8.588 0 0 1 27.187 36a8.59 8.59 0 0 1 .692-3.434 8.892 8.892 0 0 1 1.887-2.8 8.892 8.892 0 0 1 2.8-1.887A8.588 8.588 0 0 1 36 27.187Zm0 15c.86 0 1.664-.16 2.414-.48a6.197 6.197 0 0 0 1.969-1.324 6.197 6.197 0 0 0 1.324-1.969c.32-.75.48-1.555.48-2.414 0-.86-.16-1.664-.48-2.414a6.197 6.197 0 0 0-1.324-1.969 6.197 6.197 0 0 0-1.969-1.324 6.081 6.081 0 0 0-2.414-.48c-.86 0-1.664.16-2.414.48-.75.32-1.406.762-1.969 1.324a6.197 6.197 0 0 0-1.324 1.969c-.32.75-.48 1.555-.48 2.414 0 .86.16 1.664.48 2.414.32.75.762 1.406 1.324 1.969a6.197 6.197 0 0 0 1.969 1.324c.75.32 1.555.48 2.414.48Z" fill-rule="evenodd"/>
</svg>`;
</script>

<template>
    <div class="container ellipse-small mb-12 mt-11">
        <div class="flex flex-col">
            <div class="flex items-center justify-between mt-28 dog-img">
                <div class="max-w-[400px] flex flex-col gap-4">
                    <p class="font-[Nunito] text-base font-normal text-[#F4197D]">Over 5500+ courses available</p>
                    <h2 class="max-w-[375px] font-[Nunito] text-[30px] font-bold text-[#3B2A56] mark-img">
                        Affordable online Courses & learning opportunities
                    </h2>
                    <p class="font-[Nunito] text-base font-light leading-[27px] text-[#869199]">
                        Break into a new field like information technology o data science. No prior experience necessary to get started.
                        Break a new field like information technology.
                    </p>
                    <div
                        v-for="item in items"
                        :key="item"
                        class="flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="12"
                            viewBox="0 0 20 10.664"
                        >
                            <path
                                d="M5.333 4.663a.665.665 0 0 0-.47 1.14l1.196 1.195.943-.943-1.195-1.196a.665.665 0 0 0-.474-.196Zm9.334-4.663c-.17 0-.34.064-.47.192l-8.862 8.863-4.195-4.196a.666.666 0 0 0-.474-.196.665.665 0 0 0-.47 1.14l4.667 4.667c.13.13.3.194.472.194a.665.665 0 0 0 .472-.194l9.334-9.334a.665.665 0 0 0-.474-1.136Zm4.667 0c-.17 0-.34.064-.47.192l-8.862 8.863-.724-.724-.943.943 1.195 1.196c.13.13.3.194.472.194a.665.665 0 0 0 .472-.194l9.334-9.334a.666.666 0 0 0-.474-1.136Z"
                                fill="#F4197D"
                            />
                        </svg>
                        <p class="font-[Nunito] text-[17px] font-normal text-[#3B2A56]">{{ item }}</p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <div>
                        <SharedSkillCard
                            title="Learn the essential skills"
                            description="Break into a new field like format technology or data science."
                            :icon="settingIcon"
                            icon-background-color="#FFEBEE"
                        />
                    </div>

                    <div class="mt-32">
                        <SharedSkillCard
                            title="Learn the essential skills"
                            description="Break into a new field like format technology or data science."
                            :icon="homeIcon"
                            icon-background-color="#FFEBEE"
                        />
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-center mt-20 w-full">
                <p class="font-[Nunito] text-base font-normal text-[#F4197D]">Career Paths</p>
                <h2 class="font-[Nunito] text-[30px] font-bold text-[#3B2A56] mark-img move-down h-[70px]">
                    Top Careers you want to pursue
                </h2>

                <div class="w-full mt-8">
                    <SharedTechCategoriesGrid />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ellipse-small {
    background-image: url(/assets//imgs/ellipse_small.png);
    background-position: 100% 30%;
    background-repeat: no-repeat;
}

.mark-img {
    background-image: url(/assets//imgs/mark.png);
    background-position: 100% 50%;
    background-repeat: no-repeat;
}

.move-down {
    background-position: 90% 100%;
}

.dog-img {
    background-image: url(/assets//imgs/dog.png);
    background-position: 50% 100%;
    background-repeat: no-repeat;
}
</style>
