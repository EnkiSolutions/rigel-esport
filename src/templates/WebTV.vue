<script setup lang="ts">
import { ref, watch } from 'vue';
import TwitchClient from '../components/TwitchClient.vue';
import { ListContent } from '../types';
import TwitchEmbed from '../components/TwitchEmbed.vue';
import ListBase from '../components/ListBase.vue';
const props = defineProps<{
	content: ListContent<string>,
	edit: boolean
}>();
const emits = defineEmits<{
	(event: "modified", content: ListContent<string>): void
}>();
const hideEmbed = ref(false);
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
	<div>
		<ListBase v-if="edit" :edit="true"
			:items="content.items"
			:empty-item="''">
			<template #editor="{ index }">
				<input type="text" v-model="list.items[index]" />
			</template>
		</ListBase>
		<Suspense v-else>
			<template #fallback>
				Chargement
			</template>
			<TwitchClient
				:content="content.items"
				v-slot="{ profiles }">
				<TwitchEmbed
					id="embed"
					v-if="profiles.some((u) => u.stream)"
					:style="hideEmbed ? 'display:none' : ''"
					:channel="profiles.find((u) => u.stream)?.user.login"
					@error="hideEmbed = true" />
				<div id="profiles">
					<div class="card" v-for="{ user, stream } in profiles">
						<img :src='user.profile_image_url' />
						<h2>{{ user.display_name }}</h2>
						<p>{{ user.description }}</p>
						<div class="stream" v-if="stream">
							<img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
							<h3>{{ stream.title }}</h3>
							<p>{{ stream.viewer_count }} viewers</p>
							<p>Joue à {{ stream.game_name }}</p>
							<p>Stream depuis {{ stream.started_at }}</p>
						</div>
					</div>
				</div>
			</TwitchClient>
		</Suspense>
	</div>
</template>

<style scoped>
#embed {
	width: 100%;
	aspect-ratio: 16 / 9;
	background-color: #00000033;
}

#profiles {
	display: grid;
    grid-template-columns: repeat(auto-fit, minmax(344px, auto));
	gap: 16px;
}

.card {
    text-align: center;
	font-weight: bold;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px;
    padding: 16px;
}

.card img {
    width: 100%;
}

.card > img {
	border-radius: 50%;
}

.stream {
	font-weight: unset;
	background-color: var(--secondary-dk-3);
	border: 1px solid var(--secondary-lt-3);
	border-radius: 16px;
    padding: 16px;
}
</style>