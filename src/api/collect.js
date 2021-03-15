import request from '@/utils/request'

export const fetchData = (id, params) => {
  return request({
    url: `collect/${id}`,
    method: 'get',
    params,
  })
}

export const create = data => {
  return request({ url: `collect`, data, method: 'post' })
}

export const checkPassword = (id, password) => {
  return request.post(`/collect/${id}/check_password`, {
    password,
  })
}
