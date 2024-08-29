import { Component } from "vue";
import Blog from "./Blog.vue";
import Game from "./Game.vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
import BlogPost from "./BlogPost.vue";
export { default as Base } from './Base.vue';
export default {
    Blog,
    BlogPost,
    Game,
    List,
    WebTV
} as Record<string, Component>