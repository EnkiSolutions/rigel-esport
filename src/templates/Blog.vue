<script setup lang="ts">
import { ref, watch } from 'vue';
import { BlogSection } from '../types';
import Editor from '../components/Editor.vue';
import ListBase from '../components/ListBase.vue';
const props = defineProps<{
	content: BlogSection,
	edit: boolean
}>();
const emits = defineEmits<{
	(event: "modified", content: BlogSection): void
}>();
const list = ref(props.content);
watch(
    () => props.edit,
    () => {
		if (list.value.items.toString() !== props.content.items.toString())
			emits("modified", list.value);
	}
);
</script>
<template>
    <ListBase :edit="edit" :items="content.items" :empty-item="{
        title: '',
        thumbnail: '',
        author: '',
        date: '',
        summary: '',
        content: ''
    }">
        <template #editor="{ index }">
			<input type="text" v-model="list.items[index].thumbnail" />
			<input type="text" v-model="list.items[index].title" />
			<input type="text" v-model="list.items[index].author" />
			<Editor v-model="list.items[index].content" />
		</template>
        <template #item="{ item, index }">
            <router-link class="item-container card v-center" :to="'/' + content.name + '/' + index">
                <img :src="`/contents/${ item.thumbnail }`" alt="">
                <div class="description">
				    <h2>{{ item.title }}</h2>
                    <i>{{ item.author }} le {{ item.date }}</i>
                    <p>{{ item.summary }}</p>
                </div>
			</router-link>
        </template>
    </ListBase>
</template>

<style scoped>
.item-container {
    display: flex;
    gap: 16px;
    width: 100%
}
img {
    height: 156px;
    aspect-ratio: 1;
	border-radius: 50%;
}
.description {
    flex-grow: 1;
}
.v-center {
    align-items: center;
}
.card {
    text-align: center;
	font-weight: bold;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
    transition: 200ms ease-in-out;
}
</style>