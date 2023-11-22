import axios from 'axios'
import { ElMessage } from 'element-plus'

// TODO 好像ts文件无法在项目启动的时候加载
const a=''
/* 拦截客户端请求的信息，好比说单点登陆、JWT(JSON Web Token一个解决跨域身份验证的方案)，在登陆成功以后，服务端就会返回一个token(一个很长的字符串)，后面每一次请求都会携带这个token，服务端就会知道你有没有登陆了,即： 一、用户向服务器发送用户名和密码 二、验证服务器以后，会将当前信息(好比用户名，密码，登陆时间等信息)保存在当前会话中 三、而后服务器会向用户返回一个session_id，session信息写入用户的cookie中 四、后续的请求，用户都会先从cookie中取出这个session_id一并发送到服务器 五、服务器收到以后，经过比对这个session_id以前保存的数据，确认用户的身份 */
// 每一次请求不可能都要手动添加一个参数吧，因此在这里定义一个拦截器，请求发送，在这里自动将请求拦截下来，自动的往请求里面加一个参数
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    ElMessage({
      type: 'error',
      message: '请求超时'
    })
    return Promise.resolve(err)
  }
)
// 拦截服务端响应的信息
axios.interceptors.response.use(
  (axiosResponse) => {
    // {status,axiosResponse[]}//status表示http响应码{status:200},axiosResponse[]表示后端的RespBean对象{status:200,msg:"",obj}
    // HTTP响应码是200，后端本身定义了500，在RespBean中，定义为业务逻辑错误
    if (axiosResponse.status && axiosResponse.status === 200 && axiosResponse.data.status === 500) {
      // 业务逻辑错误(服务器找不到，服务器错误等，http的响应码就不是200了)
      ElMessage({
        type: 'error',
        message: axiosResponse.data.message
      })
      return
    }
    // 为何要判断这个msg是否存在呢，好比说若是请求表格里面的数据，在list中放的一个javabean，这时候data就是一个数组了，那就不必展现msg了
    if (axiosResponse.data.message) {
      /*    Message.success({
          message: axiosResponse.axiosResponse.message
        }) */
    }
    // 返回方法调用的哪里，拿到的就是服务端返回的数据
    return axiosResponse
    // 若是HTTP响应码是400,500等就会进入这个err函数中
  },
  (err) => {
    const res = err.response
    // 若是服务器没启动或者是路径错误进入此判断中
    if (!res || res.status === 504 || res.status === 404) {
      ElMessage({
        type: 'error',
        message: '服务调用失败,请检查'
      })
      return Promise.reject(err)
    }
    if (res.status === 403) {
      // 表示权限不足
      ElMessage({
        type: 'error',
        message: '权限不足，请联系管理员'
      })
      return
    }
    if (res.status === 401) {
      // 表示未登陆
      ElMessage({
        type: 'error',
        message: res.data.message // 服务器返回来的信息
      })
      return
    }
    if (res.data.message) {
      ElMessage({
        type: 'error',
        message: res.data.message
      })
      return Promise.reject(err)
    }
    ElMessage({
      type: 'error',
      message: '未知错误'
    })
  }
)
export default {
  a
}
