// import request from '@/utils/request'
import pictures from './pictures.json'
export const uploadFile = file => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (parseInt(Math.random() * 10) < 4) {
        reject(file)
      }
      const rand = Math.floor(Math.random() * pictures.length)
      const data = Object.assign({}, pictures[rand])
      data.url = data.url + '?x-bce-process=style/h200'
      resolve({
        status: 'success',
        data,
      })
    }, 1000)
  })
}
