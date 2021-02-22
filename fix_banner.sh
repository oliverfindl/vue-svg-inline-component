#!/usr/bin/env bash

REPLACE="1s/^\/\*!/\/\*\*/"

sed -i $REPLACE dist/vue-svg-inline-component-modern.min.js
sed -i $REPLACE dist/vue-svg-inline-component.min.js
