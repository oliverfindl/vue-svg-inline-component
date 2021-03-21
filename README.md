# vue-svg-inline-component

[![version](https://img.shields.io/npm/v/vue-svg-inline-component.svg?style=flat)][npm]
[![downloads](https://img.shields.io/npm/dt/vue-svg-inline-component.svg?style=flat)][npm]
[![license](https://img.shields.io/npm/l/vue-svg-inline-component.svg?style=flat)][mit]
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

[Vue][vue3] component for inline use of SVG files.

> ⚠ Compatible only with [Vue@3][vue3].

> ⚠ SVG files should be optimized beforehand (e.g.: using [SVGO](https://www.npmjs.com/package/svgo) or [SVGOMG](https://jakearchibald.github.io/svgomg/)).

---

## Planned features for 1.0.0 release

- [ ] Validate SVG / ~~[is-svg](https://www.npmjs.com/package/is-svg)~~ Bloats modern build with ~20% increase in size, also can be validated manually with transform function (should be enforced if `tag` is set to falsy value)
- [x] Optionally remove wrapper element - [v0.1.0][v0.1.0]
- [x] Transform function - [v0.1.0][v0.1.0]
- [x] Default props overrides
- [ ] ~~Optionally remove SVG before each fetch request~~ Can be achieved manually by setting svg to `null` and via `nextTick()` setting to desired value
- [x] [Fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options) - [v0.1.0][v0.1.0]
- [ ] [Axios][axios] support
- [x] Emits / Events - [v0.1.0][v0.1.0]
- [x] Basic caching - [v0.1.0][v0.1.0]
- [ ] Persistent caching with invalidation mechanism / versioning
- [ ] Lazy loading ([intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) + [template ref](https://v3.vuejs.org/guide/component-template-refs.html))
- [ ] ~~Placeholder image / element~~ Can be achieved manually by listening to first `update` event
- [ ] SVG sprites (if not fetch options and not transform function)
- [ ] [.d.ts](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) / [tsc](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ ] Analyze transpilled version and tune browserslist / remove modern build

[Axios][axios] integration details:
1. Use axios instance if provided
2. Use fetch if fetch options are provided
3. Use window.axios if exists
4. Use fetch

[v0.1.0]: https://github.com/oliverfindl/vue-svg-inline-component/releases/tag/v0.1.0
[axios]: https://github.com/axios/axios

---

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Examples](#examples)

---

## Installation

### [npm][npm]
```bash
$ npm install vue-svg-inline-component
```

### [yarn][yarn]
```bash
$ yarn add vue-svg-inline-component
```

### [unpkg][unpkg]
```html
<script src="https://unpkg.com/vue-svg-inline-component"></script>

<!-- or if you target only modern browsers, you can use modern build, which is way smaller in size -->
<script src="https://unpkg.com/vue-svg-inline-component/dist/vue-svg-inline-component-modern.min.js"></script>
```

### [jsDelivr][jsdelivr]
```html
<script src="https://cdn.jsdelivr.net/npm/vue-svg-inline-component"></script>

<!-- or if you target only modern browsers, you can use modern build, which is way smaller in size -->
<script src="https://cdn.jsdelivr.net/npm/vue-svg-inline-component/dist/vue-svg-inline-component-modern.min.js"></script>
```

## Usage

### Browser

```javascript
// initialize Vue app
const app = Vue.createApp({ /* App component */ });

// register Vue component into Vue app
app.component("svg-inline", VueSvgInlineComponent);

// mount Vue app
app.mount("#app");
```

### [Vite][vite] 

```javascript
// import createApp from Vue
import { createApp } from "vue";

// import Vue component
import VueSvgInlineComponent from "vue-svg-inline-component";

// initialize Vue app
const app = createApp({ /* App component */ });

// register Vue component into Vue app
app.component("svg-inline", VueSvgInlineComponent);

// mount Vue app
app.mount("#app");
```

## Configuration

### Default [props](https://v3.vuejs.org/guide/component-props.html)

```javascript
{
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
}
```

#### Explanation

* **`source`:**  
SVG file URL.  
Default value: `null`

* **`tag`:**  
Tag for wrapper element, in which will be SVG rendered. Can be set to `null` or `""` (empty string) if you don't want to use wrapper element, but bear in mind, this approach is more taxing on performance and is not recommended.  
⚠ If `tag` is set to `null` or `""` (empty string), `attributes` (see below) are ignored.  
Default value: `"div"`

* **`attributes`:**  
Attributes for wrapper element defined by `tag`.  
⚠ If `tag` is set to `null` or `""` (empty string), `attributes` (see above) are ignored.  
Default value: `{ class: PACKAGE_NAME }`

* **`cache`:**  
Response from each SVG file requests will be stored in global variable and will be re-used on all consecutive requests.  
⚠ Cache is not persistent between page reloads (yet).  
Default value: `true`

* **`fetchOptions`:**  
User-defined options object for [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options).  
⚠ If `fetchOptions` are set, `cache` (see above) is automatically disabled for this component instance.  
Default value: `null`

* **`transformFunction`:**  
User-defined transform function for fetched SVG files. This function will be supplied with fetched SVG file, `transformFunctionOptions` (see below) and component props.  
Example: `(svg, options, props) => svg;`  
Default value: `null`

* **`transformFunctionOptions`:**  
User-defined options for `transformFunction` (see above).  
Default value: `null`

* **`emitUpdates`:**  
Enables emitting update events.  
Default value: `false`

* **`emitErrors`:**  
Enables emitting error events.  
Default value: `false`

* **`logErrors`:**  
Enables automatic logging of error events.  
Default value: `true`

### Overrides

Default value of props could be overwritten as follows:

```javascript
VueSvgInlineComponent.props.tag.default = "span";
VueSvgInlineComponent.props.attributes.default = { class: "my-inline-svg" };
```

#### Notice
⚠ Do not try to override other value then default in prop definition, as it can result in component not working correctly.

### Events

* **`update`:**  
Fired each time component is updated. Updated SVG is passed as first argument.

* **`error`:**  
Fired each time error is detected. Error event is passed as first argument.

## Examples

* [Browser example](https://github.com/oliverfindl/vue-svg-inline-component/tree/master/examples/browser)
* [Vite example](https://github.com/oliverfindl/vue-svg-inline-component/tree/master/examples/vite)

---

## License

[MIT][mit]

[mit]: https://opensource.org/licenses/MIT
[npm]: https://www.npmjs.com/package/vue-svg-inline-component
[yarn]: https://yarnpkg.com/package/vue-svg-inline-component
[unpkg]: https://www.unpkg.com/browse/vue-svg-inline-component/
[jsdelivr]: https://www.jsdelivr.com/package/npm/vue-svg-inline-component
[vue3]: https://github.com/vuejs/vue-next
[vite]: https://github.com/vitejs/vite
