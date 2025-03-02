<script setup lang="ts">
import { featureCardsData } from '~/constants/feature-cards';

interface FeatureSectionProps {
    isLeadCapture?: boolean;
    pageVitalsData?: any | null;
    psError?: Error | null;
    isLoading?: boolean;
}

defineProps<FeatureSectionProps>();
</script>

<template>
    <section class="py-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    v-for="(card, index) in featureCardsData"
                    :key="index"
                    class="font-arial text-sm font-normal normal-case text-gray-800 bg-gray-100 py-14 px-8 text-left"
                >
                    <div class="mb-4">
                        <div
                            class="w-28 h-24 rounded-lg flex items-center justify-center image-base relative"
                            :class="`${card.className} `"
                        >
                            <div
                                class="h-9 w-9 image-base"
                                :class="`${card.smallIcon}`"
                            />
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-800 mb-2 w-[188px]">{{ card.title }}</h3>

                    <p class="text-gray-600 text-sm mb-4 min-w-[196px]">
                        {{ card.description }}
                    </p>

                    <div class="flex items-center text-sm">
                        <NuxtLink
                            :to="card.linkUrl"
                            class="text-pink-500 hover:text-pink-600"
                        >
                            {{ card.linkText }}
                            <span class="ml-1"> > </span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.live-base {
    background-image: url('/assets/imgs/certificate-base/live_base.png');
}

.in-demand-base {
    background-image: url('/assets/imgs/certificate-base/in_demand_base.png');
}

.segment-base {
    background-image: url('/assets/imgs/certificate-base/segment-base.png');
}

.interactive-base {
    background-image: url('/assets/imgs/certificate-base/interactive_base.png');
}

.live-chat {
    background-image: url('/assets/imgs/card/live.png');
}

.trendy-topic {
    background-image: url('/assets/imgs/card/demand.png');
}

.segment-learning {
    background-image: url('/assets/imgs/card/segment.png');
}

.interactive-learning {
    background-image: url('/assets/imgs/card/interactive.png');
}

.image-base {
    background-position: center center;
    background-repeat: no-repeat;
}
</style>
