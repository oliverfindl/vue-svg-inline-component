"use strict";

module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/essential"
	],
	"parser": "@babel/eslint-parser",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module",
		"requireConfigFile": false,
		"babelOptions": {}
	},
	"plugins": [
		"vue"
	],
	"rules": {
		// "no-console": process.env.WEBPACK_WATCH ? "off" : "error",
		// "no-debugger": process.env.WEBPACK_WATCH ? "off" : "error",
		"no-console": "error",
		"no-debugger": "error",
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
