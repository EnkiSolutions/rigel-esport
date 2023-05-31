<template>
    <button>
        <Suspense>
            <SVGIcon :name="icon" />
            <template #fallback>
                <slot name="fallback">
                    <div></div>
                </slot>
            </template>
        </Suspense>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import SVGIcon from './SVGIcon.vue';

defineProps({
    icon: {
        type: String,
        required: true
    }
});
</script>