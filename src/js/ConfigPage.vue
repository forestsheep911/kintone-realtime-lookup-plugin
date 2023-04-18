<template>
  <div v-for="i in data.saveConfig" :key="i.label" class="config-row">
    <span class="toggle-wrapper">
      <input :id="`css${i.label}`" v-model="i.checked" type="checkbox" />
      <label class="toggle" :for="`css${i.label}`"><span class="toggle-handler"></span></label>
    </span>
    <span class="lookup-field-name-text-parent">
      <span class="control-label-gaia lookup-field-name-text">{{ i.label }}</span>
    </span>
  </div>
  <div class="kintoneplugin-row">
    <button type="button" class="js-cancel-button kintoneplugin-button-dialog-cancel" @click="cancel">Cancel</button>
    <button type="submit" class="kintoneplugin-button-dialog-ok" @click="save">Save</button>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-console */
import { reactive, onMounted } from 'vue'
import { getFormSetting, Lookup } from './lookup.ts'

// type AddCheck<T> = {
//   [P in keyof T]: T[P]
//   checkedd? : string
// }

// type LookupC = { label: string; code: string; lookup: object; checked?: boolean }

const props = defineProps<{ pluginId: string }>()
const data: { config: Lookup[]; saveConfig: Array<{ label: string; checked: boolean; code: string }> } = reactive({
  config: [],
  saveConfig: [],
})
onMounted(async () => {
  const gettedConfig = kintone.plugin.app.getConfig(props.pluginId)
  // console.log(typeof gettedConfig)
  // console.log(gettedConfig)
  // console.log(gettedConfig.setting)
  data.saveConfig = JSON.parse(gettedConfig.setting)
  const res: Lookup[] = await getFormSetting()
  // console.log(res[1].label)
  // console.log(res.length)
  // console.log({ gettedConfig }.setting.length)
  // const parsedConfig = JSON.parse(gettedConfig) as { setting: Array<{ label: string; checked: boolean }> }
  // console.log({ gettedConfig })
  console.log(res)

  const cp = res.map((i) => {
    for (let j = 0; j < data.saveConfig.length; j += 1) {
      // console.log('res', i.label)
      // console.log('save', data.saveConfig[j].label)
      if (data.saveConfig[j].code === i.code) {
        return { code: i.code, label: i.label, checked: data.saveConfig[j].checked }
      }
    }
    return { code: i.code, label: i.label, checked: false }
  })
  console.log(cp)
  data.saveConfig = cp
  // eslint-disable-next-line require-atomic-updates
  // data.saveConfig = cp
})

function save() {
  kintone.plugin.app.setConfig({ setting: JSON.stringify(data.saveConfig) })
}

function cancel() {
  window.location.href = `../../${kintone.app.getId()}/plugin/`
}
</script>

<style>
@import '../css/config.css';
</style>
