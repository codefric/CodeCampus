import { useUIStore, type UIState } from '~/store/ui';

type ToastOptions = {
    timeout?: number;
};

export const useToast = () => {
    const uiStore = useUIStore();

    const show = (type: UIState['notifications'][number]['type'], message: string, options: ToastOptions = {}) => {
        return uiStore.showNotification({
            type,
            message,
            timeout: options.timeout,
        });
    };

    return {
        success: (message: string, options?: ToastOptions) => show('success', message, options),
        error: (message: string, options?: ToastOptions) => show('error', message, options),
        warning: (message: string, options?: ToastOptions) => show('warning', message, options),
        info: (message: string, options?: ToastOptions) => show('info', message, options),
        remove: (id: string) => uiStore.removeNotification(id),
        clear: () => uiStore.clearNotifications(),
    };
};
