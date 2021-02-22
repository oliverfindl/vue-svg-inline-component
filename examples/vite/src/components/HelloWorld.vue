<template>
	<h1>{{ message }}</h1>
	<p>
		<a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
		<a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
	</p>
	<button @click="state.count++">count is: {{ state.count }}</button>
	<p>
		Edit
		<code>components/HelloWorld.vue</code> to test hot module replacement.
	</p>
</template>

<script setup>
	"use strict";

	import { defineProps, reactive } from "vue";

	defineProps({
		message: String
	});

	const state = reactive({ count: 0 });
</script>

<style scoped>
	@charset "utf-8";

	a {
		color: #42b983;
	}
</style>