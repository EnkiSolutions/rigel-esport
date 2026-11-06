<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import providers from '../providers';

const props = defineProps<{ provider: string }>();
const emits = defineEmits(['logged']);
const params = new URL(document.location.href).searchParams;
const input = '/api/oauth/' + props.provider;
const { init, name } = providers(params.get('code')!)[props.provider];
const router = useRouter();
const previous = localStorage.getItem('origin')!;
const errorMessage = ref('');

onMounted(async () => {
    if (localStorage.getItem('state') !== params.get('state')) {
        errorMessage.value = "La vérification de sécurité a échoué. Veuillez recommencer la connexion.";
        return;
    }

    localStorage.removeItem('state');

    try {
        const apiResponse = await fetch(input, init);
        const responseBody = await apiResponse.text();
        let infos: Record<string, unknown>;

        try {
            infos = JSON.parse(responseBody) as Record<string, unknown>;
        } catch {
            throw new Error("Le serveur d’authentification a renvoyé une réponse inattendue.");
        }

        if (!apiResponse.ok) {
            throw new Error(
                typeof infos.message === 'string'
                    ? infos.message
                    : "L’authentification a échoué."
            );
        }

        emits('logged', infos);
        Object.entries(infos)
            .forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
        await router.push(previous || '/');
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : "L’authentification a échoué.";
    }
});
</script>
<template>
	<div class="page">
        <template v-if="errorMessage">
            <p>{{ errorMessage }}</p>
            <RouterLink to="/auth">Retour à la page de connexion</RouterLink>
        </template>
        <template v-else>
            <p>Connecté à {{ name }}, autorisation en cours...</p>
            <p>Vous allez être redirigé. Ne fermez pas la fenêtre</p>
        </template>
    </div>
</template>
