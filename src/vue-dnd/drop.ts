import { DirectiveBinding, ObjectDirective } from "vue";

type DropBinding<T> = {
    channel: string;
    action?: (
        e: CustomEventInit<any>,
        data: T | undefined) => void;
    data?: T;
};

export default {
    mounted<T>(el: HTMLElement, binding: DirectiveBinding<DropBinding<T>>) {
        const { channel, action, data } = binding.value;

        let enterTarget: EventTarget | null = null;

        document.addEventListener("dragstart-" + channel, () => { el.classList.add('hoverable') });
        document.addEventListener("dragend-" + channel, () => { el.classList.remove('hoverable') });

        el.addEventListener("dragenter", (e: DragEvent) => {
            enterTarget = e.target;
            e.stopImmediatePropagation();
            e.preventDefault();
            if (el.classList.contains('dragged')) return;
            if (e.dataTransfer?.types.includes(channel)) {
                e.dataTransfer!.dropEffect = "move";
                el.classList.add("dragover");
            }
        });

        el.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        
        el.addEventListener("dragleave", (e: DragEvent) => {
            if (enterTarget != e.target) return;
            e.stopImmediatePropagation();
            e.preventDefault();
            if (el.classList.contains('dragged')) return;
            if (e.dataTransfer?.types.includes(channel))
                el.classList.remove("dragover");
        });

        el.addEventListener("dropfallback", ((e: CustomEvent) => {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (el.classList.contains('dragged')) return;
            if (action) action(e, data);
        }) as EventListener);
    }
} as ObjectDirective;