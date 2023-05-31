<template>
    <component :is="icon" />
</template>
  
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({ name: { type: String } })

const icon = ref();

async function updateIcon() {
   icon.value = await import(`../assets/icon-${props.name}.svg?component`)
}

updateIcon();
watch(() => props.name, updateIcon);
</script>