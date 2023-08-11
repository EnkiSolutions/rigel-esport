<script setup lang="ts">
import { onMounted } from "vue";
import { TwitchEmbedOptions } from "../types";

const props = defineProps({
    width: {
        type: String,
        default: '400',
    },
    height: {
        type: String,
        default: '300',
    },
    volume: {
        type: Number,
        default: 0.5,
    },
    quality: {
        type: String,
        default: 'medium',
    },
    playsInline: {
        type: Boolean,
        default: false,
    },
    channel: String,
    collection: String,
    video: String,
});

const emits = defineEmits<{(event: 'error', message?: string) : void}>()
    
const options: TwitchEmbedOptions = {
    width: props.width,
    height: props.height,
    autoplay: true,
    allowFullscreen: true
};

if (props.playsInline) {
    options.playsinline = true;
}

if (props.channel) {
    options.channel = props.channel;
} else if (props.collection) {
    options.collection = props.collection;
} else if (props.video) {
    options.video = props.video;
} else {
    emits('error', 'no source')
}

onMounted(() => {
    const Twitch = (window as ( Window & typeof globalThis & { Twitch: any })).Twitch;
    new Twitch.Embed("twitch-embed", options);
})
</script>

<template>
    <div>
        <div id="twitch-embed"></div>
    </div>
</template>

<style>
#twitch-embed {
    height: 100%;
}

#twitch-embed iframe {
    width: 100%;
    height: 100%;
}
</style>