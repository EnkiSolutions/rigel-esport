import { Component } from "vue";
import List from "./List.vue";
import WebTV from "./WebTV.vue";
export { default as Base } from './Base.vue';
export default {
    List,
    WebTV
} as Record<string, Component>