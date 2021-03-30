import request from '@/utils/request'

export const index = params => {
  return request.get('/pictures', {
    params,
  })
}

export const like = id => {
  return request.post(`pictures/${id}/like`)
}

export const fetchData = uuid => {
  return request.get(`pictures/${uuid}`)
}
