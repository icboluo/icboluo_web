// 后端服务所在主机，默认本机。可通过 .env 中的 VITE_BACKEND_HOST 覆盖，以支持其他 IP 访问。
const backendHost = import.meta.env.VITE_BACKEND_HOST || '127.0.0.1'
const url = `http://${backendHost}:`
export const noteUrlPre = url + '1514/'
export const fundUrlPre = url + '8888/'
export const gameUrlPre = url + '4399/'
export const userUrlPre = url + '7010/user/'
export const stockUrlPre = url + '8889/'

export default {
  noteUrlPre,
  fundUrlPre,
  gameUrlPre,
  userUrlPre,
  stockUrlPre
}
