// composables/useBanner.ts
import { useUIStore } from '~/store/ui';

export const useBanner = (bannerId: string) => {
    const uiStore = useUIStore();

    onMounted(() => {
        uiStore.registerBanner(bannerId);
    });

    onUnmounted(() => {
        uiStore.unregisterBanner(bannerId);
    });

    const isVisible = computed(() => uiStore.banners[bannerId]?.isVisible ?? true);
    const isCollapsed = computed(() => uiStore.banners[bannerId]?.isCollapsed ?? false);

    const show = () => uiStore.showBanner(bannerId);
    const hide = () => uiStore.hideBanner(bannerId);
    const toggle = () => (isVisible.value ? hide() : show());
    const toggleCollapse = () => uiStore.toggleBannerCollapse(bannerId);

    return {
        isVisible,
        isCollapsed,
        show,
        hide,
        toggle,
        toggleCollapse,
    };
};
