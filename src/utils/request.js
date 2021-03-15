import axios from 'axios'
import store from '@/store'
import { messageError } from '@/store'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: 'http://pictures.test/api', // url = base url + request url
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
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
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

    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          messageError('错误请求')

          break

        case 401:
          messageError('未授权，请重新登录')
          router.push('/auth/login')
          break

        case 403:
          console.log(error.response.config.url)
          if (error.response.config.url.indexOf('collect/') !== 0) {
            messageError('拒绝访问')
          }
          break

        case 404:
          messageError('请求错误,未找到该资源')

          break

        case 405:
          messageError('请求方法未允许')

          break

        case 408:
          messageError('请求超时')

          break

        case 500:
          messageError('服务器端出错')

          break

        case 501:
          messageError('网络未实现')

          break

        case 502:
          messageError('网络错误')

          break

        case 503:
          messageError('服务不可用')

          break

        case 504:
          messageError('网络超时')

          break

        case 505:
          messageError('http版本不支持该请求')

          break

        default:
          messageError(`${error.response.data.message}`)
      }
    } else {
      messageError('连接到服务器失败')
    }

    return Promise.reject(error)
  }
)

export default service
