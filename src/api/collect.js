import request from '@/utils/request'

export const fetchData = (id, params) => {
  return request({
    url: `collect/${id}`,
    method: 'get',
    params,
  })
}

export const fetchIndex = params => {
  return request.get(`collect`, {
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

export const update = data => {
  return request.put(`collect/${data.link}`, data)
}

export const like = link => {
  return request.post(`collect/${link}/like`)
}

export const unlike = link => {
  return request.post(`collect/${link}/unlike`)
}
