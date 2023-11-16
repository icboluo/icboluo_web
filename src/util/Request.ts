import axios from 'axios'

interface Res<T = any> {
  data: T
  code: number
  msg: string

  isSuccess(): boolean
}

class ResImpl<T = any> implements Res<T> {
  data: T
  code: number
  msg: string

  constructor(data: T, code: number, msg: string) {
    this.data = data
    this.code = code
    this.msg = msg
  }

  isSuccess(): boolean {
    return false
  }
}

export async function sendGet(url: string, param: any) {
  console.log(param)
  console.log('interface invoke ' + url + param)
  const axiosResponse = await axios.get(url, { params: param })
  console.log()
  return axiosResponse
}

export default {
  sendGet
}
