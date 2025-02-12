import { useUIStore } from '~/store/ui';

export const useModal = () => {
    const uiStore = useUIStore();

    return {
        open: (modalId: string) => uiStore.openModal(modalId),
        close: (modalId: string) => uiStore.closeModal(modalId),
        toggle: (modalId: string) => uiStore.toggleModal(modalId),
        isOpen: (modalId: string) => uiStore.isModalOpen(modalId),
    };
};
