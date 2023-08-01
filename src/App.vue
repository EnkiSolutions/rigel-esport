<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from './components/Dropdown.vue';
import SVGIcon from './components/SVGIcon.vue';
import SVGIconButton from './components/SVGIconButton.vue';
import { Vue3Marquee } from 'vue3-marquee';
import 'vue3-marquee/dist/style.css';

const gamesDropdown = ref<InstanceType<typeof Dropdown> | null>(null);
const toggle = () => {
  gamesDropdown.value?.toggle();
};
</script>
<template>
  <div id="page">
    <div id="top">
      <router-link to="/" v-slot="{ href, navigate }" >
          <SVGIconButton icon="home" :href="href" @click="navigate" />
      </router-link>
      <router-link to="/events" v-slot="{ href, navigate }" >
          <SVGIconButton icon="events" :href="href" @click="navigate" />
      </router-link>
      <router-link to="/web-tv" v-slot="{ href, navigate }" >
          <SVGIconButton icon="tv" :href="href" @click="navigate" />
      </router-link>
      <Dropdown ref="gamesDropdown" class="dropdown menu">
        <template #selector>
          <SVGIconButton icon="game" @click="toggle" />
        </template>
        <router-link :to="{ name: 'Rocket League' }" v-slot="{ href, navigate }">
          <SVGIconButton icon="rocket-league" :href="href" 
            @click="() => { toggle(); navigate(); }">
            <div>Rocket League</div>
          </SVGIconButton>
        </router-link>
        <router-link :to="{ name: 'Valorant' }" v-slot="{ href, navigate }">
          <SVGIconButton icon="valorant" :href="href"
            @click="() => { toggle(); navigate(); }">
            <div>Valorant</div>
          </SVGIconButton>
        </router-link>
      </Dropdown>
      <div class="user menu">
        <router-link to="/coaching" v-slot="{ href, navigate }">
          <SVGIconButton icon="coaching" :href="href" @click="navigate" />
        </router-link>
        <router-link to="/shop" v-slot="{ href, navigate }">
          <SVGIconButton icon="bag" :href="href" @click="navigate" />
        </router-link>
        <router-link to="/login" v-slot="{ href, navigate }">
          <SVGIconButton icon="user" :href="href" @click="navigate" />
        </router-link>
      </div>
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
        <a href="https://discord.gg/DFWUa93sEM">
          <SVGIcon name="discord">Discord</SVGIcon>
        </a>
        <a href="https://twitter.com/Rigel_Esport">
          <SVGIcon name="twitter">Twitter</SVGIcon>
        </a>
        <a href="https://www.twitch.tv/rigel_ttv">
          <SVGIcon name="twitch">Twitch</SVGIcon>
        </a>
        <a href="https://www.tiktok.com/@rigel_esport">
          <SVGIcon name="tiktok">TikTok</SVGIcon>
        </a>
      <!--
        <SVGIcon name="facebook">Facebook</SVGIcon>
        <SVGIcon name="youtube">YouTube</SVGIcon>
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

#top {
  background-image: url('./assets/banniere.png');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: bottom;
  background-size: contain;
  height: 256px;
  display: flex;
  position: relative;
}

.dropdown {
  z-index: 1;
}

.overlay button {
  width: 160px;
}

#top a {
  height: 32px;
}

button {
  display: flex;
  line-height: 24px;
  padding: 4px;
}

.menu div {
  margin: auto;
}

svg {
  width: 24px;
  height: 24px;
}

svg,
svg g,
svg path {
  transition: 200ms;
  fill: var(--color-lt-3);
}

a:hover svg,
a:hover svg g,
a:hover svg path,
button:hover svg,
button:hover svg g,
button:hover svg path {
  fill: var(--color-lt-1);
}

.social {
  display: flex;
  width: 100%;
  height: 32px;
  line-height: 32px;
}

#partners .marquee {
  padding-left: 8px;
  gap: 8px;
}

#networks {
  display: flex;
  width: fit-content;
  height: 24px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 16px;
  gap: 8px;
}

.user {
  display: flex;
  position: absolute;
  right: 0px;
}
</style>