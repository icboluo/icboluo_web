import axios from 'axios'
import { ElMessage } from 'element-plus'

interface Res<T = any> {
  data: T
  code: string
  message: string

  isSuccess(): boolean

  isSuccessOrPopBox(): boolean
}

class ResImpl<T = any> implements Res<T> {
  data: T
  code: string
  message: string

  constructor(data: T, code: string, message: string) {
    this.data = data
    this.code = code
    this.message = message
  }

  isSuccess(): boolean {
    return this.code === '0' || this.code === '200'
  }

  isSuccessOrPopBox(): boolean {
    if (this.isSuccess()) {
      return true
    } else {
      ElMessage.error(this.message || 'error')
      return false
    }
  }
}

export async function axiosGet(url: string, param: any) {
  const axiosResponse = await axios.get(url, { params: param })
  return axiosResponse
}

export async function get(url: string, param: any):Promise<Res> {
  const axiosResponse = await axios.get(url, { params: param })
  const resImpl = new ResImpl(axiosResponse.data, axiosResponse.code, axiosResponse.message)
  return resImpl
}

// TODO 没有中断效果
export async function simpleGet(url: string, param: any):Promise<any> {
  let res = await get(url, param)
  if (res.isSuccessOrPopBox()) {
    return res.data
  }
}

export default {
  axiosGet,
  get,
  simpleGet
}
