/**
 * 根据路由名称 填充搜索提示文字
 */
export const searchPlaceholder = route => {
  switch (route.name) {
    case 'CollectIndex':
      return '输入关键字搜索分享集'
    case 'UserIndex':
      return '输入关键字搜索相关动态'
    case 'UserCollect':
      if (route.params.type && route.params.type === 'liked') {
        return '输入关键字查找此用户赞过的分享集'
      }
      return '输入关键字查找此用户的分享集'
    default:
      return '输入关键字查找图片'
  }
}
export const isShow = name => {
  return (
    ['Index', 'CollectIndex', 'UserIndex', 'UserCollect'].indexOf(name) > -1
  )
}
