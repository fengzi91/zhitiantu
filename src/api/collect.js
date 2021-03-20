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
  return request({ url: `collects`, data, method: 'post' })
}

export const checkPassword = (id, password) => {
  return request.post(`/collects/${id}/check_password`, {
    password,
  })
}

export const update = data => {
  return request.put(`collects/${data.link}`, data)
}

export const like = link => {
  return request.post(`collects/${link}/like`)
}
