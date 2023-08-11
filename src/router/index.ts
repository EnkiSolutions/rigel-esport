import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Page from "../components/Page.vue"
import sitemap from "../pages/sitemap.json";
import { h } from 'vue';

let routes: RouteRecordRaw[]  = [
  { 
    path: '/:pathMatch(.*)',
    component: h("<div>Oups ! Cette page n'existe pas</div>")
  },
  {
    path: '/',
    redirect: '/home'
  }
];
let section: keyof typeof sitemap;
for (section in sitemap) {
  const path = section == "$r" 
    ? '/:page'
    : '/' + section + '/:page'
  routes.push({
    path,
    component: Page,
    props: true
  });
}
export default createRouter({
  history: createWebHistory(),
  routes,
})