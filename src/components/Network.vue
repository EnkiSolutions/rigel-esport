<script setup lang="ts">
import { PropType } from 'vue';
import { Network } from '../types';
import SVGIconButton from './SVGIconButton.vue';
const props = defineProps({
    network: {
        type: Object as PropType<Network>,
        required: true
    }
});

const getConfig = () => {
    switch (props.network.provider) {
        default:
        case 'facebook':
            return {
                style: { backgroundColor: "#0866ff" },
                link: "https://facebook.com/%s/"
            };
        case 'instagram':
            return {
                style: { background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" },
                link: "https://instagram.com/%s/"
            };
        case 'twitter':
            return {
                style: { backgroundColor: "#000" },
                link: "https://twitter.com/%s"
            };
        case 'twitch':
            return {
                style: { backgroundColor: "#8e42fe" },
                link: "https://twitch.tv/%s/"
            };
        case 'tiktok':
            return {
                style: { background: "linear-gradient(135deg, #25f4ee, #fe2c55)", fill: "#000" },
                link: "https://tiktok.com/@%s"
            };
    }
}
const format = (...a: string[]) => {
    return a.reduce((p: string, c: any) => p.replace(/%s/, c));
}
const { style, link } = getConfig();
</script>
<template>
    <a :href="format(link, network.id)" target="_blank">
        <SVGIconButton
            class="button-like"
            :style="style"
            :icon="network.provider"
            />
    </a>
</template>
<style scoped>
a {
    flex-grow: 1;
}
.button-like {
    width: 100%;
    justify-content: center;
	border: 1px solid var(--secondary-lt-2);
	border-radius: 0 0 16px 16px;
    transition: 200ms ease-in-out;
}
.button-like:hover {
    transform: translateY(4px);
}
:deep(svg) {
    width: 32px;
    height: 32px;
}
</style>