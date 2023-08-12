<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from './components/Dropdown.vue';
import Menu from './components/Menu.vue';
import SVGIcon from './components/SVGIcon.vue';
import SVGIconButton from './components/SVGIconButton.vue';
import { $r, game } from "./pages/sitemap.json";
import { Vue3Marquee } from 'vue3-marquee';
import 'vue3-marquee/dist/style.css';

const gamesDropdown = ref<InstanceType<typeof Dropdown> | null>(null);
const toggle = () => {
  gamesDropdown.value?.toggle();
};

const mainMenu = $r.slice(0, 3);
const userMenu = $r.slice(3, 5);
userMenu.push({ icon: "user", path: "auth", title: "Connexion"});
</script>
<template>
  <div id="page">
    <div id="top">
      <Menu
        :routes="mainMenu"
        v-slot="{ icon, href, navigate }" >
          <SVGIconButton :icon="icon!" :href="href" @click="navigate" />
      </Menu>
      <Dropdown ref="gamesDropdown" class="dropdown menu">
        <template #selector>
          <SVGIconButton icon="game" @click="toggle" />
        </template>
        <Menu
          root="game"
          :routes="game"
          v-slot="{ icon, title, href, navigate }">
          <SVGIconButton :icon="icon!" :href="href" @click="navigate">
            <div>{{ title }}</div>
          </SVGIconButton>
        </Menu>
      </Dropdown>
      <Menu
        class="user menu"
        :routes="userMenu"
        v-slot="{ icon, href, navigate }" >
          <SVGIconButton :icon="icon!" :href="href" @click="navigate" />
      </Menu>
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
    <router-view v-slot="{ Component }">
      <template v-if="Component">
          <Transition mode="out-in">
              <KeepAlive>
                  <Suspense>
                      <component :is="Component" :key="$route.path" />
                      <template #fallback>
                          Chargement...
                      </template>
                  </Suspense>
              </KeepAlive>
          </Transition>
      </template>
    </router-view>

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

#top nav {
	display: flex;
}

#top a {
  height: 32px;
}

.dropdown {
  z-index: 1;
}

.overlay > nav {
  flex-direction: column;
}

.overlay button {
  width: 160px;
}

.overlay a {
  text-align: center;
	font-size: 0.8rem;
	transition: font-size 1s;
}

.overlay a:hover {
	font-size: 0.9rem;
}

.overlay a.router-link-active {
	font-size: 1rem;
}

#top button {
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

.menu svg,
.menu svg g,
.menu svg path {
  transition: 200ms;
  fill: var(--color-lt-3);
}

.menu a:hover svg,
.menu a:hover svg g,
.menu a:hover svg path,
.menu button:hover svg,
.menu button:hover svg g,
.menu button:hover svg path {
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

.page {
    height: calc(100vh - 288px);
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.page {
		height: 64vh;
		scroll-snap-type: y mandatory;
	}

	#title {
		display: none;
	}
}
</style>