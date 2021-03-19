import request from '@/utils/request'

export const index = params => {
  return request.get('http://pictures.test/api/random', {
    params,
  })
}

export const like = id => {
  return request.post(`picture/${id}/like`)
}
