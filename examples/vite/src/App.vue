<template>
	<svg-inline v-if="source" :source="source" :tag="null" :attributes="{ class: 'class-from-props counter-from-props-' + counter }" :cache="cache" :transform-function="transformFunction" :transform-function-options="transformFunctionOptions" :emitUpdates="true" :emitErrors="true" @update="onUpdate" @error="onError" />
	<HelloWorld message="Hello Vue 3 + Vite" />
</template>

<script setup>
	"use strict";

	import { ref, onMounted } from "vue";
	import HelloWorld from "./components/HelloWorld.vue";

	const logos = [ "vuejs/art/master/logo.svg", "FortAwesome/Font-Awesome/master/svgs/brands/vuejs.svg" ].map(svg => `https://raw.githubusercontent.com/${svg}`);

	const counter = ref(0);
	const source = ref(logos[counter.value]);
	const cache = ref(false);

	const transformFunction = (svg, options, props) => svg.replace(/(<svg)/, `$1 class="svg-icon class-from-transform-function ${options.class} counter-from-transform-function-${counter.value} ${props.attributes.class}"`).replace(/<!--.*?-->/g, "");
	const transformFunctionOptions = { class: `class-from-transform-function-options counter-from-transform-function-options-${counter.value}` };

	const onUpdate = svg => console.log("Logging update:", svg);
	const onError = error => console.error("Logging error:", error);

	onMounted(() => setInterval(() => {
		source.value = logos[(counter.value % 2 === 0) | 0];
		cache.value = counter.value > 3;
		// console.log("Counter:", counter.value);
		// console.log("Source:", source.value);
		// console.log("Cache enabled:", cache.value);
		counter.value++;
	}, 1e3));

	// This starter template is using Vue 3 experimental <script setup> SFCs
	// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
	@charset "utf-8";

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	#app .svg-icon {
		display: inline-flex;
		width: 200px; height: 200px;
	}
</style>