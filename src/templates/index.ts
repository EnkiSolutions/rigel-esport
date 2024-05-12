import { Component } from "vue";
import Blog from "./Blog.vue";
import Game from "./Game.vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
export { default as Base } from './Base.vue';
export default {
    Blog,
    Game,
    List,
    WebTV
} as Record<string, Component>