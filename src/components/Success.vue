<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import providers from '../providers';

const props = defineProps<{ provider: string }>();
const emits = defineEmits(['logged']);
const params = new URL(document.location.href).searchParams;
const input = '/api/oauth/' + props.provider;
const { init, name } = providers(params.get('code')!)[props.provider];
const router = useRouter();
const previous = localStorage.getItem('origin')!;
onMounted(async () => {
    if (localStorage.getItem('state') != params.get('state')) return;
    const infos = await(await fetch(input, init)).json();
    emits("logged", infos);
    Object.entries(infos)
        .forEach(v => localStorage.setItem(v[0], JSON.stringify(v[1])));
    router.push(previous);
});
</script>
<template>
	<div class="page">
        <p>Connecté à {{ name }}, autorisation en cours...</p>
        <p>Vous allez être redirigé. Ne fermez pas la fenêtre</p>
    </div>
</template>