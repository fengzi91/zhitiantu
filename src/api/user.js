import request from '@/utils/request'

export const updateInfo = data => {
  return request.post('user', data)
}
