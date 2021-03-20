import request from '@/utils/request'

export const me = () => {
  return request.get(`me`)
}
export const fetchUserInfo = id => {
  return request.get(`user/${id}`)
}

export const updateInfo = data => {
  return request.post('user', data)
}

export const updatePassword = data => {
  return request.post('password', data)
}

export const fetchCollect = params => {
  return request.get('user/collect', { params })
}
