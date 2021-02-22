"use strict";

const { resolve } = require("path");
const { BannerPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const PACKAGE_PATH = resolve(__dirname, "package.json");

const {
	name: PACKAGE_NAME,
	version: PACKAGE_VERSION,
	author: PACKAGE_AUTHOR,
	license: PACKAGE_LICENSE,
	homepage: PACKAGE_HOMEPAGE
} = require(PACKAGE_PATH);

const LIBRARY_NAME = PACKAGE_NAME.split("-").map(character => character.charAt(0).toUpperCase() + character.slice(1).toLowerCase()).join("");

module.exports = ({ WEBPACK_WATCH, modern: MODERN_BUILD } = {}) => ({
	entry: [
		resolve(__dirname, `src/${PACKAGE_NAME}`),
		...(!MODERN_BUILD ? [ "whatwg-fetch" ] : [])
	],
	mode: WEBPACK_WATCH ? "development" : "production",
	output: {
		filename: `${PACKAGE_NAME}${MODERN_BUILD ? "-modern" : ""}.min.js`,
		library: LIBRARY_NAME,
		libraryExport: "default",
		libraryTarget: "umd",
		path: resolve(__dirname, "dist")
	},
	module: {
		rules: [ {
			test: /\.js$/i,
			exclude: /node_modules/,
			loader: "babel-loader",
			options: {
				presets: !MODERN_BUILD ? [ [ "@babel/preset-env", {
					useBuiltIns: "usage",
					corejs: 3
				} ] ] : []
			}
		} ]
	},
	resolve: {
		extensions: [ ".js", ".json" ]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false
			})
		]
	},
	plugins: [
		...(!WEBPACK_WATCH ? [ new BannerPlugin({
			banner: `
					[file]
					@author ${PACKAGE_AUTHOR}
					@version ${PACKAGE_VERSION}
					@license ${PACKAGE_LICENSE}
					@link ${PACKAGE_HOMEPAGE}
				`
				.replace(/\t+/g, "")
				.trim(),
			entryOnly: true
		}) ] : []),
		...(!MODERN_BUILD ? [ new BundleAnalyzerPlugin() ] : []),
		new ESLintPlugin({
			files: [ "src/**/*.js" ],
			emitError: true,
			emitWarning: true,
			failOnError: true,
			failOnWarning: true
		})
	],
	devtool: WEBPACK_WATCH ? "eval-cheap-module-source-map" : "source-map",
	target: WEBPACK_WATCH ? "web" : "browserslist",
	externals: {
		vue: "Vue"
	}
});
