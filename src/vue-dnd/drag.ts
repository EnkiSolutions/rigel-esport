import { DirectiveBinding, ObjectDirective } from "vue";

export type DragBinding = {
    channels: string[];
    filter?: (el: HTMLElement) => (HTMLElement | null)[];
    callbacks: DropCallbacks;
};

export type DropAction = (dropzone: Element, el?: Element) => void;

type DropCallbacks = {
    effects: {
        selectors: string;
        action: DropAction;
    }[];
};

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding<DragBinding>) {
        const { channels, filter, callbacks } = binding.value;
        const { effects } = callbacks;

        el.toggleAttribute("draggable", true);

        el.addEventListener("dragstart", (event: DragEvent) => {
            event.stopPropagation();
            event.dataTransfer!.effectAllowed = "move";

            if (filter) {
                const f = filter(el);
                for (const filtered of f) 
                    filtered?.classList.add('dragged');
            }
            
            for (const channel of channels) {
                document.dispatchEvent(new Event("dragstart-"+channel));
                event.dataTransfer?.setData(channel, "");
            }
        });

        el.addEventListener("dragend", (event: DragEvent) => {
            event.stopPropagation();

            // Drop fallback
            el.hidden = true;
            const elemBelow = document.elementFromPoint(event.clientX, event.clientY)!;
            el.hidden = false;

            if (elemBelow) {
                let dropzone;
                for(const effect of effects)
                    if (dropzone = elemBelow.closest(effect.selectors)) {
                        effect.action(dropzone, el);
                        break;
                    }
            }
            
            for (const channel of channels) 
                document.dispatchEvent(new Event("dragend-"+channel));

            if (filter) {
                const f = filter(el);
                for (const filtered of f) 
                    filtered?.classList.remove('dragged');
            }
        });
    }
} as ObjectDirective;