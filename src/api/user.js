import request from '@/utils/request'

export const updateInfo = data => {
  return request.post('user', data)
}

export const updatePassword = data => {
  return request.post('password', data)
}

export const fetchCollect = params => {
  return request.get('user/collect', { params })
}
