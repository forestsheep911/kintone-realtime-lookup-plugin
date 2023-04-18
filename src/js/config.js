"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var vue_1 = require("vue");
var ConfigPage_vue_1 = require("./ConfigPage.vue");
var pluginId = kintone.$PLUGIN_ID;
var main = document.getElementById('main');
var app = (0, vue_1.createApp)(ConfigPage_vue_1.default, { pluginId: pluginId });
app.mount(main);
