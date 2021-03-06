import request from '@/utils/request'

export const login = data => {
  return request({
    url: 'authorizations',
    method: 'post',
    data,
  })
}

export const register = data => {
  return request({
    url: 'register',
    method: 'post',
    data,
  })
}

export const csrfCookie = () => {
  return request.get('/sanctum/csrf-cookie')
}

export const logout = () => {
  return request.delete('logout')
}
