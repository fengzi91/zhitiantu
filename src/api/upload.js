import request from '@/utils/request'

export const uploadFile = data => {
  return request.post(`upload`, data)
}
