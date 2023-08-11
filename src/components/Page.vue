<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import routes from "../pages/sitemap.json";
import { Base, default as templates } from '../templates'
const edit = ref(false);
const { fullPath } = useRoute();
const splittedPath = fullPath.split("/");
splittedPath.shift();
const page = splittedPath.pop();
const root = splittedPath.pop()??"$r";
const title = routes[root].find(v => v.path == page)?.title;
const { template, content } = await import(`../pages/${root}/${page}.json`);
localStorage.setItem('origin', fullPath);
const login = localStorage.getItem('login')
const onModified = async (c: string) => await fetch(
	window.location.origin + '/api/github/updateFile',
	{
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			root: root,
			page: page,
			content: JSON.stringify({content: c})
		})
	}
);
</script>

<template>
	<div class="page">
		<div id="title">
			<h1>{{ title }}</h1>
			<button v-if="login"
				@click="edit = !edit">
				{{ edit ? "Mettre-à-jour" : "Editer" }}
			</button>
		</div>
		<component v-if="template"
			:is="templates[template]"
			:content="content"
			:edit="edit"
			@modified="onModified" />
		<Base v-else
			:content="content"
			:edit="edit"
			@modified="onModified" />
	</div>
</template>

<style>
.page {
    height: calc(100vh - 360px);
    overflow-y: auto;
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.page {
		height: 64vh;
		scroll-snap-type: y mandatory;
	}

	#title {
		display: none;
	}
}
</style>