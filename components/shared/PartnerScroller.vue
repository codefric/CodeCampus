<script setup lang="ts">
interface Partner {
    id: number;
    name: string;
    image: string;
    className: string;
}

const partners = ref<Partner[]>([
    { id: 1, name: 'Drink', image: 'drink.png', className: 'partner-drink' },
    { id: 2, name: 'Curva', image: 'curva.png', className: 'partner-curva' },
    { id: 3, name: 'Contour', image: 'contour.png', className: 'partner-contour' },
    { id: 4, name: 'Vogoda', image: 'vogoda.png', className: 'partner-vogoda' },
    { id: 5, name: 'Coglia', image: 'coglia.png', className: 'partner-coglia' },
]);
</script>

<template>
    <div class="relative overflow-hidden w-full bg-white py-4">
        <div class="flex animate-scroll">
            <!-- First set of logos -->
            <div class="flex items-center space-x-16 px-8">
                <div
                    v-for="partner in partners"
                    :key="partner.id"
                    :title="partner.name"
                    class="partner-logo"
                    :class="partner.className"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.partner-logo {
    width: 150px;
    height: 24px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.partner-drink {
    background-image: url('/assets/imgs/partners/drink.png');
}

.partner-curva {
    background-image: url('/assets/imgs/partners/curva.png');
}

.partner-contour {
    background-image: url('/assets/imgs/partners/contour.png');
}

.partner-vogoda {
    background-image: url('/assets/imgs/partners/vogado.png');
}

.partner-coglia {
    background-image: url('/assets/imgs/partners/coglia.png');
}

/* 
@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}

.animate-scroll {
    animation: scroll 20s linear infinite;
} */
</style>
