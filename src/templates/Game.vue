<script setup lang="ts">
import { ref, watch } from 'vue';
import { ListContent, Team } from '../types';
import ListBase from '../components/ListBase.vue';
import TeamMember from '../components/TeamMember.vue';
const props = defineProps<{
	content: ListContent<Team>,
	edit: boolean
}>();
const emits = defineEmits<{
	(event: "modified", content: ListContent<Team>): void
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
	<ListBase :edit="edit" :items="content.items"
		:empty-item="{ name: '', members: [] }">
		<template #editor="{ index }">
			<input type="text" v-model="list.items[index].name" />
			<ListBase :edit="true" :items="list.items[index].members"
				:empty-item="{ name: '', title: '', avatar: '', age: 18, bio: '', networks: [] }">
				<template #editor="{ index: i }">
					<input type="text" v-model="list.items[index].members[i].name" />
					<input type="text" v-model="list.items[index].members[i].title" />
					<input type="text" v-model="list.items[index].members[i].avatar" />
					<input type="text" v-model="list.items[index].members[i].age" />
					<input type="text" v-model="list.items[index].members[i].bio" />
					<ListBase :edit="true" :items="list.items[index].members[i].networks"
						:empty-item="{ provider: '', id: '' }">
						<template #editor="{ index: j }">
							<input type="text" v-model="list.items[index].members[i].networks[j].provider" />
							<input type="text" v-model="list.items[index].members[i].networks[j].id" />
						</template>
					</ListBase>
				</template>
			</ListBase>
		</template>
		<template #item="{ item }">
			<div class="item-container">
				<h2>{{ item.name }}</h2>
				<div class="horizontal">
					<TeamMember v-for="member in item.members" :member="member" />
				</div>
			</div>
		</template>
	</ListBase>
</template>

<style scoped>
.item-container {
	width: 100%;
}
.horizontal {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>