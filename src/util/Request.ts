import { ElMessage } from 'element-plus'
import type {
  AxiosResponse,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders
} from 'axios'
import axios from 'axios'
import type { PageInfo } from '@/components/BaseTable.vue'

interface InterfaceRes<T = any> {
  data: T
  code: string
  message: string
}

interface Res<T = any> extends AxiosResponse<T> {
  /**
   * 状态码
   */
  code: string
  /**
   * 消息
   */
  message: string

  /**
   * 判断接口响应是否成功
   */
  isSuccess(): boolean

  /**
   * 判断接口响应是否成功，如果失败，弹窗提示
   */
  isSuccessOrPopBox(): boolean
}

class ResImpl<T = any> implements Res<T> {
  code: string
  message: string

  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig
  request?: any

  constructor(axi: AxiosResponse<InterfaceRes>) {
    this.code = axi.data.code
    this.message = axi.data.message

    this.data = axi.data.data
    this.status = axi.status
    this.statusText = axi.statusText
    this.headers = axi.headers
    this.config = axi.config
    this.request = axi.request
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

export async function axiosPost(url: string, param: any) {
  return await axios.post(url, param)
}

export async function post(url: string, param: any): Promise<Res> {
  const axiosResponse = await axios.post(url, param)
  return new ResImpl(axiosResponse)
}

export async function simplePost(url: string, param: any): Promise<any> {
  const res = await post(url, param)
  if (res.isSuccessOrPopBox()) {
    return res.data
  } else {
    // 异步抛异常
    return Promise.reject(new Error('interface.error'))
  }
}

export async function postPage(
  url: string,
  pageInfo: PageInfo,
  param?: any
): Promise<Res<PageInfo>> {
  if (!param) {
    param = {}
  }
  Object.assign(param, {
    pageSize: pageInfo.pageSize,
    pageNum: pageInfo.pageNum
  })
  const axiosResponse: AxiosResponse<InterfaceRes> = await axios.post(url, param)
  const resImpl = new ResImpl(axiosResponse)
  if (resImpl.isSuccess()) {
    pageInfo.pageNum = resImpl.data.pageNum
    pageInfo.pageSize = resImpl.data.pageSize
    pageInfo.total = resImpl.data.total
  }
  return resImpl
}

export async function simplePostPage(
  url: string,
  pageInfo: PageInfo,
  param?: any
): Promise<PageInfo> {
  const res = await postPage(url, pageInfo, param)
  if (res.isSuccessOrPopBox()) {
    return res.data
  } else {
    // 异步抛异常
    return Promise.reject(new Error('interface.error'))
  }
}

export async function upload(url: string, formData: FormData): Promise<ResImpl> {
  const axiosResponse = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return new ResImpl(axiosResponse)
}

export async function simpleUpload(url: string, formData: FormData): Promise<any> {
  const res = await upload(url, formData)
  if (res.isSuccess()) {
    return res.data
  } else {
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: res.message || 'error'
    })
    // 异步抛异常
    return Promise.reject(new Error('interface.error'))
  }
}

export default {
  simplePost,
  simplePostPage
}
