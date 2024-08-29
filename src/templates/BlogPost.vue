<script setup lang="ts">
import { ref, watch } from 'vue';
import Editor from '../components/Editor.vue';
import { BlogPostContent } from '../types';
const props = defineProps<{ content: BlogPostContent, edit: boolean }>();
const emit = defineEmits<{ (event: "modified", content: BlogPostContent): void }>()
let mutable = ref(props.content);
watch(
    () => props.edit,
    () => {
		if (mutable.value.article != props.content.article)
			emit("modified", mutable.value)
	}
);
</script>

<template>
	<div class="author">{{ mutable.author }} le {{ mutable.date }}</div>
	<Editor v-if="edit" v-model="mutable.article" />
	<article v-else v-html="mutable.article"></article>
</template>

<style scoped>
.author,
:deep(.author) {
	text-align: right;
	font-style: italic;
}
article {
	text-align: justify;
}
:deep(p) {
	text-indent: 64px;
}
:deep(p::first-letter) {
	font-size: 150%;
	font-weight: bolder;
	color: var(--secondary-lt-3);
}
:deep(blockquote) {
	display: block;
	margin: 32px;
	padding: 16px;
	border: 1px solid var(--secondary-lt-3);
	background-color: var(--secondary-dk-3);
	color: var(--secondary-lt-3);
	font-size: .95em;
	font-style: italic;
	line-height: 1.9em;
	text-indent: 64px;
}
:deep(.quote::before),
:deep(.quote::after) {
	content: "\FF02";
	color: var(--secondary-lt-4);
	font-size: 150%;
	font-weight: bolder;
}
:deep(.author::before) {
	content: "- ";
}
</style>