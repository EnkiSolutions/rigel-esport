<script setup lang="ts">
function getState() {
    const state = Array.from(
        crypto.getRandomValues(new Uint8Array(32)),
        byte => byte.toString(16).padStart(2, '0')
    ).join('');
    localStorage.setItem('state', state);
    return state;
}
function connectGitHub() {
    location.href = `https://github.com/login/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
        scope: "read:user repo workflow",
        state: getState(),
        redirect_uri: window.location.origin + '/auth/github/success'
    })}`
}
function connectDiscord() {
    location.href = `https://discord.com/oauth2/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_DISCORD_APPLICATION_ID,
        scope: "guilds.join identify",
        state: getState(),
        redirect_uri: window.location.origin + '/auth/discord/success',
        response_type: "code",
        prompt: "consent"
    })}`;
}
</script>

<template>
	<div class="page">
        <button @click="connectGitHub">Connect with GitHub</button>
        <button @click="connectDiscord">Connect with Discord</button>
    </div>
</template>
