"use strict";

import { createApp } from "vue";
import App from "./App.vue";
import VueSvgInlineComponent from "../../../src";

const app = createApp(App)

app.component("svg-inline", VueSvgInlineComponent);

app.mount("#app");
