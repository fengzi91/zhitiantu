import request from '@/utils/request'

export const index = params => {
  return request.get('http://pictures.test/api/random', {
    params,
  })
}
