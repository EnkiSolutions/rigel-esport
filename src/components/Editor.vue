<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit';
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3';
import { Image } from '@tiptap/extension-image'; // Import the Image extension
import { Link } from '@tiptap/extension-link';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Div } from '../tiptap/nodes'
import SVGIcon from './SVGIcon.vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emits = defineEmits(['update:modelValue']);

const editor = ref<Editor>()

const setLevel = (v: Event) => { 
    if (!editor.value) return;
    const value = (v.target as HTMLSelectElement).value;
    switch (value) {
        case "p":
            editor.value.chain().focus().setParagraph().run();
            break;
        case "u":
            editor.value.chain().focus().toggleBulletList().run()
            break;
        case "o":
            editor.value.chain().focus().toggleOrderedList().run()
            break;
        default:
            editor.value.chain().focus().toggleHeading({ 
                level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 
            }).run();
            break;
    }
}

watch(() => props.modelValue, (value) => {
    const isSame = editor.value?.getHTML() === value
    //const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(value)

    if (isSame) {
        return
    }

    editor.value?.commands.setContent(value, false)
});

const insertImage = () => {
  const imageUrl = prompt('Enter the URL of the image:');
  if (imageUrl) {
    editor.value?.chain().focus().setImage({ src: imageUrl }).run();
  }
};

const createLink = () => {
  const url = prompt('Enter the URL of the link:');
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
};

onMounted(() => editor.value = new Editor({
    extensions: [
        StarterKit,
        Image.configure({
            inline: true, // Set to 'true' if you want the images to be inserted inline
        }),
        Link.configure({
            openOnClick: false, // Set to 'true' if you want the links to open on click
        }),
        Div
    ],
    content: props.modelValue,
    onUpdate: () => {
        emits('update:modelValue', editor.value?.getHTML())
        //emits('update:modelValue', editor.getJSON())
    },
}))

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
    <div id="editor-menu" v-if="editor">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" style="--clr:#FF44CC">
            <SVGIcon name="arrow-go-back-line" alt="undo" /><span></span>
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" style="--clr:#39FF14">
            <SVGIcon name="arrow-go-forward-line" alt="redo" /><span></span>
        </button>
        <BubbleMenu :editor="editor" :tippyOptions="{ duration: 100 }">
            <button
                :disabled="!(editor.isActive('bold') || editor.isActive('italic') || editor.isActive('italic'))"
                @click="editor.chain().focus().unsetAllMarks().run()">
                <SVGIcon name="format-clear" alt="clear marks" /><span></span>
            </button>
            <button
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()">
                <SVGIcon name="bold" alt="bold" /><span></span>
            </button>
            <button
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()">
                <SVGIcon name="italic" alt="italic" /><span></span>
            </button>
            <button :class="{ 'is-active': editor.isActive('createLink') }" @click="createLink">
                <SVGIcon name="link" alt="create link" /><span></span>
            </button>
            <select @change="setLevel">
                <option value="p">paragraph</option>
                <option value="u">bullet list</option>
                <option value="o">ordered list</option>
                <option value="1">header 1</option>
                <option value="2">header 2</option>
                <option value="3">header 3</option>
                <option value="4">header 4</option>
                <option value="5">header 5</option>
                <option value="6">header 6</option>
            </select>
            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
                <SVGIcon name="quote-text" alt="blockquote" /><span></span>
            </button>
        </BubbleMenu>
        <FloatingMenu :editor="editor" :tippy-options="{ duration: 100 }">
            <button
                :disabled="!(editor.isActive('bold') || editor.isActive('italic') || editor.isActive('italic'))"
                @click="editor.chain().focus().unsetAllMarks().run()">
                <SVGIcon name="format-clear" alt="clear marks" /><span></span>
            </button>
            <button :class="{ 'is-active': editor.isActive('insertImage') }" @click="insertImage">
                <SVGIcon name="image-line" alt="insert image" /><span></span>
            </button>
            <button
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()">
                <SVGIcon name="bold" alt="bold" /><span></span>
            </button>
            <button
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()">
                <SVGIcon name="italic" alt="italic" /><span></span>
            </button>
            <select @change="setLevel">
                <option value="p">paragraph</option>
                <option value="u">bullet list</option>
                <option value="o">ordered list</option>
                <option value="1">header 1</option>
                <option value="2">header 2</option>
                <option value="3">header 3</option>
                <option value="4">header 4</option>
                <option value="5">header 5</option>
                <option value="6">header 6</option>
            </select>
            <button
                :class="{ 'is-active': editor.isActive('blockquote') }"
                @click="editor.chain().focus().toggleBlockquote().run()">
                <SVGIcon name="quote-text" alt="blockquote" /><span></span>
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
                <SVGIcon name="separator" alt="horizontal rule" /><span></span>
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()">
                <SVGIcon name="text-wrap" alt="hard break" /><span></span>
            </button>
        </FloatingMenu>
    </div>
    <editor-content :editor="editor" />
</template>

<style>
[id^="tippy-"] button,
#editor-menu button {
    width: 32px;
    height: 32px;
}

[id^="tippy-"] svg,
#editor-menu svg {
    width: 24px;
    height: 24px;
}

[id^="tippy-"] button:disabled,
#editor-menu button:disabled {
	background-color: var(--2-txt);
}

[id^="tippy-"] button:disabled span,
#editor-menu button:disabled span {
	display: none;
}

[id^="tippy-"] button,
#editor-menu button {
	position: relative;
	border: 1px solid var(--1-bg);
	background-color: var(--1-txt);
	padding: 3px;
	transition: 200ms;
}

[id^="tippy-"] button svg path,
#editor-menu button svg path {
    color: var(--2-bg);
}

[id^="tippy-"] button.is-active,
#editor-menu button.is-active {
    background-color: var(--2-bg);
}

[id^="tippy-"] button.is-active svg path,
#editor-menu button.is-active svg path {
    color: var(--1-txt);
}

[id^="tippy-"] button.is-active span::before,
[id^="tippy-"] button.is-active span::after,
#editor-menu button.is-active span::before,
#editor-menu button.is-active span::after {
	border: 2px solid var(--1-txt);
}

[id^="tippy-"] button:not(:disabled):hover,
#editor-menu button:not(:disabled):hover {
	background-color: var(--2-bg);
}

[id^="tippy-"] button:not(:disabled):hover svg path,
#editor-menu button:not(:disabled):hover svg path{
    color: var(--1-txt);
}

[id^="tippy-"] button span,
#editor-menu button span {
	position: absolute;
	inset: 0;
	display: block;
}

[id^="tippy-"] button span::before,
[id^="tippy-"] button span::after,
#editor-menu button span::before,
#editor-menu button span::after {
	content: "";
	position: absolute;
	border: 2px solid var(--2-bg);
    width: 0px;
    transition: 200ms cubic-bezier(0.0, 0.8, 0.8, 1.0);
}

[id^="tippy-"] button:not(:disabled):hover span::before,
[id^="tippy-"] button:not(:disabled):hover span::after,
#editor-menu button:not(:disabled):hover span::before,
#editor-menu button:not(:disabled):hover span::after {
	border: 2px solid var(--1-txt);
	width: calc(100% - 2px)
}

[id^="tippy-"] button span::before,
#editor-menu button span::before {
	left: -1px;
	top: -1px;
}

[id^="tippy-"] button span::after,
#editor-menu button span::after {
	right: -1px;
	bottom: -1px;
}
</style>