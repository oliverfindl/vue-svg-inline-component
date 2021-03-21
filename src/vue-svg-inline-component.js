"use strict";

import { defineComponent, toRefs, ref, computed, watch, onMounted, nextTick, h as render } from "vue";

// import PACKAGE_JSON from "../package.json";

// const PACKAGE_NAME = PACKAGE_JSON.name;

// const LIBRARY_NAME = PACKAGE_NAME.split("-").map(character => character.charAt(0).toUpperCase() + character.slice(1).toLowerCase()).join("");

const PACKAGE_NAME = "vue-svg-inline-component";

const LIBRARY_NAME = "VueSvgInlineComponent";

const WINDOW_CACHE_ID = `${LIBRARY_NAME}Cache`;

const WINDOW_VUE_VERSION = window?.Vue?.version;

const EVENTS = [ "update", "error" ];

const DEFAULT_ATTRIBUTES = { class: PACKAGE_NAME };

const REGEXP_SVG_FILENAME = /\.svg(?:[?#].*)?$/i;

const validateSvgFilename = filename => typeof filename === "string" && filename !== "" ? REGEXP_SVG_FILENAME.test(filename) : true;

window[WINDOW_CACHE_ID] = window[WINDOW_CACHE_ID] || new Map;

export default WINDOW_VUE_VERSION && !WINDOW_VUE_VERSION.startsWith("3.") ? console.error(`[${PACKAGE_NAME}] Only Vue@3 is supported! [Vue.version=${WINDOW_VUE_VERSION}]`) : defineComponent({ // eslint-disable-line no-console

	name: PACKAGE_NAME,

	props: {
		source: {
			type: String,
			required: true,
			default: null,
			validator: validateSvgFilename
		},
		tag: {
			type: String,
			required: false,
			default: "div"
		},
		attributes: {
			type: Object,
			required: false,
			default: DEFAULT_ATTRIBUTES
		},
		cache: {
			type: Boolean,
			required: false,
			default: true
		},
		fetchOptions: {
			type: Object,
			required: false,
			default: null
		},
		transformFunction: {
			type: Function,
			required: false,
			default: null
		},
		transformFunctionOptions: {
			// type: any,
			required: false,
			default: null
		},
		emitUpdates: {
			type: Boolean,
			required: false,
			default: false
		},
		emitErrors: {
			type: Boolean,
			required: false,
			default: false
		},
		logErrors: {
			type: Boolean,
			required: false,
			default: true
		}
	},

	emits: EVENTS,

	setup(props, { emit }) {
		const {
			source,
			cache: isCacheEnabled,
			fetchOptions,
			transformFunction,
			transformFunctionOptions,
			emitUpdates: canEmitUpdate,
			emitErrors: canEmitError,
			logErrors: canLogError
		} = toRefs(props);

		const canUseCache = computed(() => isCacheEnabled.value && !fetchOptions.value);

		const svg = ref();

		const emitError = error => {
			if(canEmitError.value) emit(EVENTS[1], error);
			if(canLogError.value) console.error(`[${PACKAGE_NAME}] ${error}`); // eslint-disable-line no-console
		};

		const emitUpdate = () => {
			if(canEmitUpdate.value) nextTick()
				.then(() => emit(EVENTS[0], svg.value))
				.catch(emitError);
		};

		const fetchSvg = () => {
			if(!source.value) return svg.value = null;
			(canUseCache.value && window[WINDOW_CACHE_ID].has(source.value) ? Promise.resolve(window[WINDOW_CACHE_ID].get(source.value)) : window.fetch(source.value, fetchOptions.value)
				.then(response => {
					if(response.status < 200 || response.status >= 400) throw new Error(`Wrong HTTP response status code! [response.status=${response.status}]`);
					return response.text();
				}))
				.then(response => {
					if(canUseCache.value && !window[WINDOW_CACHE_ID].has(source.value)) window[WINDOW_CACHE_ID].set(source.value, response);
					svg.value = transformFunction.value ? transformFunction.value.call(null, response, transformFunctionOptions.value, props) : response;
				})
				.catch(emitError);
		};

		onMounted(() => {
			fetchSvg();
			watch([ source, fetchOptions, transformFunction, transformFunctionOptions ], fetchSvg);
			watch(svg, emitUpdate);
		});

		return { svg };
	},

	render() {
		const { tag, attributes, svg } = this;

		if(!svg) return;

		if(!tag) {
			const { tagName: tag, attributes, innerHTML } = (new DOMParser()).parseFromString(svg, "text/xml").getElementsByTagName("svg")[0];
			return render(tag, Object.assign({}, Array.from(attributes).reduce((accumulator, { name, value }) => Object.assign(accumulator, { [name]: value }), {}), { innerHTML }));
		}

		return render(tag, Object.assign({}, attributes, { innerHTML: svg }));
	}

});
