import request from '@/utils/request'

export const fetchTags = params => {
  return request.get(`tags`, {
    params,
  })
}
