"use strict";

import { createApp } from "vue";
import App from "./App.vue";
import VueSvgInlineComponent from "vue-svg-inline-component";
// import VueSvgInlineComponent from "../vue-svg-inline-component"; // symlink

const app = createApp(App);

app.component("svg-inline", VueSvgInlineComponent);

app.mount("#app");
