<script setup lang="ts">
import SVGIcon from './SVGIcon.vue';

defineProps({
    icon: {
        type: String,
        required: true
    }
});
</script>

<template>
    <button>
        <SVGIcon :name="icon" />
        <slot></slot>
    </button>
</template>