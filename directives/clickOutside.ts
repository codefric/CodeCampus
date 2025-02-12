export interface ClickOutsideElement extends HTMLElement {
    _clickOutside?: {
        handler: (event: MouseEvent) => void;
    };
}

export const clickOutside = {
    mounted(el: ClickOutsideElement, binding: { value: () => void }) {
        el._clickOutside = {
            handler: (event: MouseEvent) => {
                if (!el.contains(event.target as Node) && event.target !== el) {
                    binding.value();
                }
            },
        };

        document.addEventListener('click', el._clickOutside.handler, true);
    },

    unmounted(el: ClickOutsideElement) {
        if (el._clickOutside) {
            document.removeEventListener('click', el._clickOutside.handler, true);
            delete el._clickOutside;
        }
    },
};
