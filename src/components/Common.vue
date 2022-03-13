<template>
  <div></div>
</template>

<script>

import axios from 'axios'// 一个基于 promise 的 HTTP 库 npm install axios便可安装
import {Message} from 'element-ui'// 这里用的element-ui中的Message消息提示插件

export default {
  name: 'Common',
  noteUrlPre: 'http://127.0.0.1:1514',
  fundUrlPre: 'http://127.0.0.1:8888',
  data () {
    return {
      abc: 'ssssssss'
    }
  }
}

/* 拦截客户端请求的信息，好比说单点登陆、JWT(JSON Web Token一个解决跨域身份验证的方案)，在登陆成功以后，服务端就会返回一个token(一个很长的字符串)，后面每一次请求都会携带这个token，服务端就会知道你有没有登陆了,即： 一、用户向服务器发送用户名和密码 二、验证服务器以后，会将当前信息(好比用户名，密码，登陆时间等信息)保存在当前会话中 三、而后服务器会向用户返回一个session_id，session信息写入用户的cookie中 四、后续的请求，用户都会先从cookie中取出这个session_id一并发送到服务器 五、服务器收到以后，经过比对这个session_id以前保存的数据，确认用户的身份 */
// 每一次请求不可能都要手动添加一个参数吧，因此在这里定义一个拦截器，请求发送，在这里自动将请求拦截下来，自动的往请求里面加一个参数
axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.error({
    message: '请求超时'
  })
  return Promise.resolve(err)
})
// 拦截服务端响应的信息
axios.interceptors.response.use(data => { // {status,data[]}//status表示http响应码{status:200},data[]表示后端的RespBean对象{status:200,msg:"",obj}
  // HTTP响应码是200，后端本身定义了500，在RespBean中，定义为业务逻辑错误
  if (data.status && data.status === 200 && data.data.status === 500) {
    // 业务逻辑错误(服务器找不到，服务器错误等，http的响应码就不是200了)
    Message.error({
      message: data.data.msg
    })
    return
  }
  // 为何要判断这个msg是否存在呢，好比说若是请求表格里面的数据，在list中放的一个javabean，这时候data就是一个数组了，那就不必展现msg了
  if (data.data.msg) {
    Message.success({
      message: data.data.msg
    })
  }
  // 返回方法调用的哪里，拿到的就是服务端返回的数据
  return data.data.data
}, err => {
  // 若是HTTP响应码是400,500等就会进入这个err函数中
  // 若是服务器没启动或者是路径错误进入此判断中
  if (!err.response || err.response.status === 504 || err.response.status === 404) {
    Message.error({
      message: '服务调用失败,请检查'
    })
  } else if (err.response.status === 403) { // 表示权限不足
    Message.error({
      message: '权限不足，请联系管理员'
    })
  } else if (err.response.status === 401) { // 表示未登陆
    Message.error({
      message: err.response.data.msg// 服务器返回来的信息
    })
  } else {
    if (err.response.data.msg) {
      Message.error({
        message: err.response.data.msg
      })
    } else {
      Message.error({
        message: '未知错误'
      })
    }
  }
})

// 请求前缀，之后若是要给服务器统一增长一个前缀，只须要更改这里就好
let base = ''
// get请求接口
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    params: params,
    url: `${base}${url}`
  })
}
</script>

<style scoped>

</style>
