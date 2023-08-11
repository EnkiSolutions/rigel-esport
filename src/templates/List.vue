<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components';
import { ref, watch } from 'vue';
import { Content, ListContent } from '../types';
import Editor from '../components/Editor.vue';
import ListBase from '../components/ListBase.vue';


const props = defineProps<{
	content: ListContent<Content>,
	edit: boolean
}>();
const emits = defineEmits<{ 
	(event: "modified", content: ListContent<Content>): void }>()
const list = ref(props.content);
const isVisible = ref(new Array<boolean>(list.value.items.length).fill(false))
function onElementVisibility(state: boolean, element: number) {
	isVisible.value[element] = state;
}
watch(
    () => props.edit,
    () => {
		if (list.value.items.toString() !== props.content.items.toString())
			emits("modified", list.value);
	}
);
</script>

<template>
	<ListBase :edit="edit" :items="content.items"
		:empty-item="{ image: '', title: '', description: '<p></p>' }">
		<template #editor="{ index }">
			<input type="text" v-model="list.items[index].image" />
			<input type="text" v-model="list.items[index].title" />
			<Editor v-model="list.items[index].description" />
		</template>
		<template #item="{ item, index }">
			<div class="item-container" v-element-visibility="(state: boolean) => onElementVisibility(state, index)">
				<div class="image-container">
					<img :src="item.image" />
				</div>
				<Teleport v-if="isVisible[index]" to="#main-logo">
					<img class="image-ext" :src="item.image" />
				</Teleport>
				<div class="item">
					<h2>{{ item.title }}</h2>
					<div v-html="item.description"></div>
				</div>
			</div>
		</template>
	</ListBase>
</template>

<style scoped>
.item-container {
	display: flex;
    flex-grow: 1;
	padding: 8px;
}

:deep(.item-line) {
	min-height: 344px;
}

:deep(.item-line):nth-child(even) > .item-container {
	flex-direction: row-reverse;
}
.image-container {
	display: flex;
	width: 344px;
	min-height: 344px;
	align-items: center;
}

img {
	max-width: 344px;
	max-height: 344px;
	height: auto;
}

.item {
	max-width: calc(80% - 344px);
	margin: auto;
	text-align: center;
}

.image-ext {
	display: none;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.image-container {
		display: none;
	}
	
	.image-ext {
		display: initial;
	}

	.item {
		max-width: 100%;
	}
}
</style>