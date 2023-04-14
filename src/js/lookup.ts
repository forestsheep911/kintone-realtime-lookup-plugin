/* eslint-disable no-console */
/* eslint-disable no-debugger */
import { KintoneRestAPIClient } from '@kintone/rest-api-client'

export type Lookup = { label: string; code: string; lookup: object }
const client = new KintoneRestAPIClient({
  baseUrl: 'https://cndevqpofif.cybozu.cn',
})

export const getFormSetting = async () => {
  const prop = (await client.app.getFormFields({ app: 63 })).properties
  const lookUpFields = Object.values(prop).filter((f) => 'lookup' in f) as Lookup[]
  return lookUpFields
}

// export default getFormSetting
