<script setup lang="ts">
import { PropType } from 'vue';
import { Member } from '../types';
import Network from './Network.vue';
defineProps({
    member: {
        type: Object as PropType<Member>,
        required: true
    }
});
</script>

<template>
    <div class="flex gap v-center">
        <img :src='`/contents/${ member.avatar }`'>
        <div class="grow">
            <div class="flex card gap">
                <div>
                    <div>Pseudo</div>
                    <div v-if="member.title">Rôle</div>
                    <div>Age</div>
                    <div v-if="member.bio">Bio</div>
                </div>
                <div class="grow">
                    <div>{{ member.name }}</div>
                    <div>{{ member.title }}</div>
                    <div>{{ member.age }}</div>
                    <div>{{ member.bio }}</div>
                </div>
            </div>
            <div class="flex grow">
                <Network v-for="network in member.networks" :network="network" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
.grow {
    flex-grow: 1;
}
.gap {
    gap: 16px;
}
.v-center {
    align-items: center;
}
.card {
    text-align: center;
	font-weight: bold;
	background-color: var(--secondary-dk-2);
	border: 1px solid var(--secondary-lt-2);
	border-radius: 16px 16px 0 0;
    padding: 16px;
    transition: 200ms ease-in-out;
}
.card:hover {
    transform: translateY(-4px);
}
img {
    height: 156px;
    aspect-ratio: 1;
	border-radius: 50%;
	border: 1px solid var(--secondary-lt-2);
}
</style>