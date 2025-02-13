import { useUIStore, type DrawerPlacement, type DrawerSize } from '~/store/ui';

export function useDrawer(drawerId: string) {
    const store = useUIStore();

    // Register drawer on component mount
    const register = (options: { size?: DrawerSize; placement?: DrawerPlacement } = {}) => {
        store.registerDrawer(drawerId, options);
    };

    // Clean up on component unmount
    const unregister = () => {
        store.unregisterDrawer(drawerId);
    };

    const isOpen = computed(() => store.isDrawerOpen(drawerId));
    const drawerState = computed(() => store.getDrawerState(drawerId));

    const open = () => store.openDrawer(drawerId);
    const close = () => store.closeDrawer(drawerId);
    const toggle = () => store.toggleDrawer(drawerId);
    const updateSize = (size: DrawerSize) => store.updateDrawerSize(drawerId, size);
    const updatePlacement = (placement: DrawerPlacement) => store.updateDrawerPlacement(drawerId, placement);

    return {
        register,
        unregister,
        isOpen,
        drawerState,
        open,
        close,
        toggle,
        updateSize,
        updatePlacement,
    };
}
