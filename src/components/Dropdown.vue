<template>
    <div ref="target">
        <slot name="selector">
            <button @click="toggle()">
                <i :class="icon"></i>
                <div>
                    {{ label }}
                </div>
            </button>
        </slot>
        <div class="overlay" v-show="show">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue';

defineProps({
    icon: { type: String },
    label: { type: String }
});

const target = ref();
const show = ref(false);
onClickOutside(target, () => { show.value = false; });

const toggle = () => show.value = !show.value;

defineExpose({ toggle });
</script>

<style scoped>
.overlay {
    position: absolute;
}
</style>