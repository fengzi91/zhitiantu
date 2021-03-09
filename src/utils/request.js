import axios from 'axios'
import qs from 'qs'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: 'http://192.168.10.10:7300/mock/6030b80f8597090fca427ff5/api/v1', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = 'getToken()'
    }
    config.data = qs.stringify(config.data)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // code === 0 ? success :  error

    return response.data
  },
  error => {
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息

    // if (error && error.response) {
    //   switch (error.response.status) {
    //     case 400:
    //       Message.error('错误请求')
    //
    //       break
    //
    //     case 401:
    //       Message.error('未授权，请重新登录')
    //       router.replace({ path: '/401' })
    //       break
    //
    //     case 403:
    //       Message.error('拒绝访问')
    //
    //       break
    //
    //     case 404:
    //       Message.error('请求错误,未找到该资源')
    //       router.replace({ path: '/404' })
    //
    //       break
    //
    //     case 405:
    //       Message.error('请求方法未允许')
    //
    //       break
    //
    //     case 408:
    //       Message.error('请求超时')
    //
    //       break
    //
    //     case 500:
    //       Message.error('服务器端出错')
    //
    //       break
    //
    //     case 501:
    //       Message.error('网络未实现')
    //
    //       break
    //
    //     case 502:
    //       Message.error('网络错误')
    //
    //       break
    //
    //     case 503:
    //       Message.error('服务不可用')
    //
    //       break
    //
    //     case 504:
    //       Message.error('网络超时')
    //
    //       break
    //
    //     case 505:
    //       Message.error('http版本不支持该请求')
    //
    //       break
    //
    //     default:
    //       Message.error(`连接错误${error.response.status}`)
    //   }
    // } else {
    //   Message.error('连接到服务器失败')
    // }

    return Promise.reject(error)
  }
)

export default service
