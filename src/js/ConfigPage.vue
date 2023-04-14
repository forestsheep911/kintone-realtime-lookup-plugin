<template>
  <div v-for="i in data.msg" :key="i.code" class="kintoneplugin-row">
    <!-- <input type="checkbox" class="input-checkbox-cybozu config-check-box" /> -->
    <span class="toggleWrapper">
      <input :id="`css${i.label}`" class="dn" type="checkbox" />
      <label class="toggle" :for="`css${i.label}`"><span class="toggle-handler"></span></label>
    </span>
    <span class="control-label-gaia">{{ i.label }}</span>
  </div>
  <p class="kintoneplugin-row">
    <button type="button" class="js-cancel-button kintoneplugin-button-dialog-cancel" @click="handleCancel">
      Cancel
    </button>
    <button type="submit" class="kintoneplugin-button-dialog-ok" @click="handleSubmit">Save</button>
  </p>
</template>

<script setup lang="ts">
/* eslint-disable no-console */
import { reactive, onMounted } from 'vue'
import { getFormSetting, Lookup } from './lookup.ts'

const props = defineProps<{
  msgIn: object
}>()
const data: { msg: Lookup[] } = reactive({
  msg: [],
})
onMounted(async () => {
  const res = await getFormSetting()
  data.msg = res
})

function handleSubmit() {
  kintone.plugin.app.setConfig({ message: data.msg }, () => {
    console.log(1)
  })
  // window.location.href = `../../flow?app=${kintone.app.getId()}`
}

function handleCancel() {
  // window.location.href = `../../${kintone.app.getId()}/plugin/`
}
</script>

<style>
@import '../css/config.css';
</style>
