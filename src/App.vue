<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from './components/Dropdown.vue';
import SVGIcon from './components/SVGIcon.vue';
import SVGIconButton from './components/SVGIconButton.vue';
import { Vue3Marquee } from 'vue3-marquee'
import 'vue3-marquee/dist/style.css'

const gamesDropdown = ref<InstanceType<typeof Dropdown> | null>(null);
const toggle = () => {
  gamesDropdown.value?.toggle();
};
</script>
<template>
  <div id="page">
    <div class="top">
      <Dropdown ref="gamesDropdown" class="dropdown menu">
        <template #selector>
          <SVGIconButton :icon="($route.meta.icon as string)??'game'"
            @click="toggle">
            <div>{{ $route.name?.toString()??'Nos jeux' }}</div>
          </SVGIconButton>
        </template>
        <router-link :to="{ name: 'Rocket League' }" v-slot="{ href, navigate }">
          <SVGIconButton :href="href" icon="rocket-league" 
            @click="() => { toggle(); navigate(); }">
            <div>Rocket League</div>
          </SVGIconButton>
        </router-link>
        <router-link :to="{ name: 'Valorant' }" v-slot="{ href, navigate }">
          <SVGIconButton :href="href" icon="valorant" 
            @click="() => { toggle(); navigate(); }">
            <div>Valorant</div>
          </SVGIconButton>
        </router-link>
      </Dropdown>
      <!--
      <div class="user menu">
        <router-link to="/shop">
          <SVGIcon name="bag" />
        </router-link>
        <router-link to="/login">
          <SVGIcon name="user" />
        </router-link>
      </div>
      -->
    </div>
    <div class="social menu">
      <Vue3Marquee id="partners" clone pauseOnHover>
        <div>Partenaires</div>
        <div>Partenaires</div>
        <div>Partenaires</div>
        <div>Partenaires</div>
        <div>Partenaires</div>
        <div>Partenaires</div>
      </Vue3Marquee>
      <div id="networks">
        <SVGIcon name="discord">Discord</SVGIcon>
        <SVGIcon name="twitter">Twitter</SVGIcon>
        <SVGIcon name="twitch">Twitch</SVGIcon>
      <!--
        <SVGIcon name="facebook">Facebook</SVGIcon>
        <SVGIcon name="youtube">YouTube</SVGIcon>
        <SVGIcon name="tiktok">TikTok</SVGIcon>
        <SVGIcon name="instagram">Instagram</SVGIcon>
      -->
    </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#page {
  min-width: 960px;
  max-width: 960px;
  text-align: center;
}

.top {
  background-image: url('./assets/banniere.png');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: bottom;
  background-size: contain;
  height: 256px;
  display: flex;
  position: relative;
}

.dropdown button {
  width: 160px;
}

.menu button {
  display: flex;
  line-height: 32px;
  padding: 0px 8px;
}

.menu div {
  margin: auto;
}

.menu svg {
  width: 32px;
  height: 32px;
}

.menu svg,
.menu svg g,
.menu svg path {
  fill: var(--color-lt-2);
}

.social {
  display: flex;
  width: 100%;
}

#partners {
  line-height: 32px;
}

#partners .marquee {
  padding-left: 8px;
  gap: 8px;
}

#networks {
  display: flex;
  width: fit-content;
  padding-left: 16px;
  gap: 8px;
}

.user {
  display: flex;
  position: absolute;
  right: 0px;
}
</style>