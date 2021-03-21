import request from '@/utils/request'

export const index = params => {
  return request.get('/pictures', {
    params,
  })
}

export const like = id => {
  return request.post(`picture/${id}/like`)
}
