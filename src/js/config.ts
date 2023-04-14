/* eslint-disable no-console */
import { createApp } from 'vue'
import ConfigPage from './ConfigPage.vue'

const pluginId = kintone.$PLUGIN_ID
const main = document.getElementById('main') as HTMLDivElement
const app = createApp(ConfigPage, { pluginId })
app.mount(main)
