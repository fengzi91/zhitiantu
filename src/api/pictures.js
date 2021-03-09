import request from '@/utils/request'

export const index = params => {
  return request.get('http://laravel-breeze.test/api/random', {
    params,
  })
}
