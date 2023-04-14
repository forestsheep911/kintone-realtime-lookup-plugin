import { createApp } from 'vue'
// import getFormSetting from './lookup.ts'
import DesktopApp from './DesktopApp.vue'

const pid = kintone.$PLUGIN_ID

kintone.events.on('app.record.index.show', (event: KintoneEvent) => {
  const config = kintone.plugin.app.getConfig(pid)
  const spaceElement = kintone.app.getHeaderSpaceElement() as HTMLElement
  const app = createApp(DesktopApp, { msg: config.message })
  app.mount(spaceElement)
  return event
})

kintone.events.on('app.record.edit.submit', (event: KintoneEvent) => {
  return event
})

kintone.events.on('app.record.detail.show', async (event: KintoneEvent) => {
  // console.log(event)
  // const adel = kintone.app.record.getFieldElement('kcAddressNameRef')
  // event.record.kcAddressNameRef.value = '{{ bbs}}'
  // const res = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json'), 'GET', { app: 63 })
  // console.log(res)

  // console.log(button.render())
  // await getFormSetting()
  // const props = fs.properties
  // console.log(props)

  // const k = Object.keys(props)
  // for (let i = 0; i < k.length; i += 1) {
  //   const arrayItem = props[k[i]]
  //   console.log(arrayItem)
  // }
  // Object.keys(fs.properties).forEach((k) => {
  //   console.log(k, fs.properties[k as keyof typeof fs.properties])
  // })
  // const filtered = keyArray.filter()
  // console.log(keyArray)

  // debugger
  return event
})
