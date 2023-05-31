<script setup lang="ts">
import TwitchProfile from '../components/TwitchProfile.vue'
</script>
<template>
    <h1>Twitch profiles</h1>
    <Suspense>
        <TwitchProfile v-slot="{ user, stream }"
            :userlist="['rigel_deku', 'tomz_5', 'miiika34000', 'guiguiiik']">
            <img :src='user.profile_image_url' />
            <h2>{{ user.display_name }}</h2>
            <p>{{ user.description }}</p>
            <div v-if="stream">
            <img :src='stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080")' />
            <h3>{{ stream.title }}</h3>
            <p>{{ stream.viewer_count }} viewers</p>
            <p>Joue à {{ stream.game_name }}</p>
            <p>Stream depuis {{ stream.started_at }}</p>
            </div>
        </TwitchProfile>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
</template>