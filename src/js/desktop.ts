/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { KintoneRestAPIClient } from '@kintone/rest-api-client'
import { createApp } from 'vue'
import { getFormSetting, Lookup } from './lookup.ts'
import DesktopApp from './DesktopApp.vue'

const pid = kintone.$PLUGIN_ID

const client = new KintoneRestAPIClient({
  baseUrl: 'https://cndevqpofif.cybozu.cn',
})
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

// 需要更详细的结构，所以扩充了Lookup类型
type SpecificLookup = Lookup & {
  lookup: {
    relatedApp: { app: string; code: string } // 所参照的app
    fieldMappings: Array<{ field: string; relatedField: string }> // 同时复制的字段
    relatedKeyField: string // 本lookup字段的字段代码
  }
}

/**
 * 根据所给的需要参照的app，给出该条记录的信息。record的编号则需要通过解析href得到
 * @param targetApp
 * @param hle
 * @returns
 */
async function getTargetRecord(targetApp: string, hle: HTMLAnchorElement) {
  const targetRecordId = (hle.href.match(/record=(\d)/) as string[])[1]
  const targetRecord = await client.record.getRecord({ app: targetApp, id: targetRecordId })
  return targetRecord
}

kintone.events.on('app.record.detail.show', async (event: KintoneEvent) => {
  // 先拿到插件的设定，表示哪些lookup字段需要适用实时参照功能
  const savedConfig: Array<{ label: string; checked: boolean; code: string }> = JSON.parse(
    kintone.plugin.app.getConfig(pid).setting,
  )
  // 拿到本app的form信息，从中只拿lookup字段的信息
  const lookupSetting: SpecificLookup[] = (await getFormSetting()) as SpecificLookup[]
  // 比对form信息和插件设定信息，从而得到一个真正需要起作用的lookup字段们
  // 我不需要得到比设定内容更多的lookup，即使新增了lookup字段，却还未在插件中设定过，反正默认他们也是disable，所以以savedConfig为基础循环比较好
  const enabledLookupSetting = savedConfig.map((i) => {
    for (let j = 0; j < lookupSetting.length; j += 1) {
      if (i.checked && lookupSetting[j].code === i.code) {
        // saveConfig中只有最基础的信息，而我们在这里将要使用很多lookup中的设定信息，比如参照的app，其他要复制的字段的对应关系等，所以这里返回SpecificLookup类的东西
        return lookupSetting[j]
      }
    }
    return undefined
  })
  console.log(enabledLookupSetting)
  // 对这些lookup字段们进行循环
  for (let i = 0; i < enabledLookupSetting.length; i += 1) {
    // 简化变量名且帮助ts检查空
    const els = enabledLookupSetting[i]
    if (els) {
      const code = els.code as string
      // 拿到looup的html元素，希望它是一个<a>即HTMLAnchorElement,但其实并不一定，因为如果是空，kintone给出的结构将跳过<a>这一层，直接给下一层的<span>
      const anchorEle = (kintone.app.record.getFieldElement(code) as HTMLElement).firstChild
      // 如果不是<a>,即没有参照信息，接下来所有的操作都可以跳过了，这个判断也cover了href为空的可能性
      if (anchorEle && anchorEle instanceof HTMLAnchorElement) {
        const targetRecord = await getTargetRecord(els.lookup.relatedApp.app, anchorEle)
        // 正常情况下，spanEle 会是一个 instance of HTMLSpanElement，但万一是其他，反正textContent也应该拿得到，这里就先不加断言
        const spanEle = anchorEle.firstChild
        if (spanEle && spanEle.textContent) {
          // 把lookup所参照的值赋值给元素
          // 注意，这里不能用赋值给event.record；return event;来做，因为kookup类型的字段，kintone不支持通过event来改变值
          // 得到值的写法比较繁琐，这是由于所参照的app的字段代码，在lookup的设定对象嵌套比较深
          // 另一种考虑是不再获取sapn，直接给anchorELe赋值，也能达到差不多的效果，优点是简单，缺点是改变了结构，span消失了
          spanEle.textContent = targetRecord?.record[els.lookup.relatedKeyField].value as string
          // 其他要复制的字段也要把参照值复制过来
          // 写在这个if下的原因是，如果lookup的值不是参照来的，那为了数据一致性，其他要赋值的字段最好也不要显示参照的值
          console.log(els.lookup.fieldMappings)
          els.lookup.fieldMappings.map((mapping) => {
            const oneele = (kintone.app.record.getFieldElement(mapping.field) as HTMLElement).firstChild
            if (!oneele || !oneele.textContent) return null
            const overwriteValue = targetRecord?.record[mapping.relatedField].value
            if (overwriteValue instanceof Array) {
              const firstItem = overwriteValue[0] as { name: string }
              if (firstItem && 'name' in firstItem) {
                oneele.textContent = firstItem.name
                return null
              }
            }
            console.log(typeof overwriteValue)
            console.log(overwriteValue)
            oneele.textContent = overwriteValue as string
            return null
          })
        }
      }
    }
  }
  return event
})
