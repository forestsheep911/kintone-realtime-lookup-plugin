/* eslint-disable no-console */
import { createApp } from 'vue'
import ConfigPage from './ConfigPage.vue'

const config = kintone.plugin.app.getConfig(kintone.$PLUGIN_ID)
;(async () => {
  // console.log(res)
  const main = document.getElementById('main') as HTMLDivElement
  const app = createApp(ConfigPage, { msgIn: config.message })
  app.mount(main)
})()
