import request from '@/utils/request'

export const fetchData = id => {
  return request({
    url: `collect/${id}`,
    method: 'get',
  })
}
