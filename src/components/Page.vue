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
let title = "";
const route = routes[root];
if (typeof(route) != "string")
	title = routes[root].find(v => v.path == page)?.title;
else {
	const splittedRoute = route.split("/");
	const node = await import(`../pages/${splittedRoute[0]}/${splittedRoute[1]}.json`);
	title = node.content.items[parseInt(page!)].title;
}
const { template, content, info, warning } = await import(`../pages/${root}/${page}.json`);
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
		<aside v-if="warning" class="warning" v-html="warning"></aside>
		<aside v-if="info" class="info" v-html="info"></aside>
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
aside {
	margin: 32px;
	padding: 16px;
	border: 1px solid var(--secondary-lt-2);
}
.warning {
	background-color: var(--yel-dk2);
	border: 1px solid var(--yel-lt2);
}
.info {
	background-color: var(--blu-dk2);
	border: 1px solid var(--blu-lt2);
}
.page {
    overflow-y: auto;
}
</style>