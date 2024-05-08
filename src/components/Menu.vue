<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
    root: {
        type: String
    },
    routes: {
        type: Array as PropType<{ path:string, icon?: string, title?: string }[]>,
        required: true
    }
});
const emits = defineEmits(["navigate"])
</script>

<template>
  	<nav class="menu">
		<template v-for="route in routes">
			<a v-if="route.path.startsWith('http')" :href="route.path">
				<slot
					:icon="route.icon"
					:title="route.title">
					{{ route.title }}
				</slot>
			</a>
			<router-link v-else
				@click="emits('navigate')"
				:to="(root ? `/${root}` : '') + `/${route.path}`"
				v-slot="{ href, navigate }"
			>
				<slot
					:icon="route.icon"
					:title="route.title"
					:href="href"
					:navigate="navigate">
					{{ route.title }}
				</slot>
			</router-link>
		</template>
	</nav>
</template>