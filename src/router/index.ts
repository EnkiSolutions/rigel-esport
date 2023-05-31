import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Game from '../pages/Game.vue';

const routes = [
  { path: '/', component: Home },
  { 
    path: '/game/rocket-league',
    name: 'Rocket League',
    component: Game,
    meta: { icon: 'rocket-league' }
  },
  {
    path: '/game/valorant',
    name: 'Valorant',
    component: Game,
    meta: { icon: 'valorant' }
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})