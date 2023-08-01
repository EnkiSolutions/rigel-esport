<script setup lang="ts">
import { TwitchProfile, TwitchStream, TwitchUser } from '../types';

const props = defineProps<{
	content: string[]
}>();

const request = await fetch('/api/TwitchClient');
const json = await request.json();
const header = await json.twitchHeader;

async function fetchUsers(users: string[]): Promise<TwitchUser[]> {
	const params = new URLSearchParams(users.map((u) => ['login', u]));

	const response = await fetch('https://api.twitch.tv/helix/users?' + params, {
		headers: header,
	});

	type JSONResponse = {
		data: TwitchUser[]
	}

	const { data }: JSONResponse = await response.json();

	if (response.ok) {
		if (data) {
			return data;
		} else {
			return Promise.reject(new Error(`No user found`));
		}
	} else return Promise.reject(new Error(`No response`));
}

async function fetchStreams(ids: string[]): Promise<TwitchStream[]> {
	const params = new URLSearchParams(ids.map((u) => ['user_id', u]));

	const response = await fetch('https://api.twitch.tv/helix/streams?' + params, {
		headers: header,
	});

	type JSONResponse = {
		data: TwitchStream[]
	}
	const { data }: JSONResponse = await response.json();

	if (response.ok) {
		if (data) {
			return data;
		} else {
			return Promise.reject(new Error(`No user found`));
		}
	} else return Promise.reject(new Error(`No response`));
}

const userlist = props.content;

const profiles: TwitchProfile[] = await fetchUsers(userlist)
	.then(async (users) => {
		const streams = await fetchStreams(users.map(v => v.id));
		return users.map((user) => { return {
				user: user,
				stream: streams.find((v) => v.user_id == user.id)
			}})
			.sort((a, b) => userlist.indexOf(a.user.login) - userlist.indexOf(b.user.login));
	});

</script>

<template>
	<slot :profiles="profiles"></slot>
</template>

<style scoped></style>