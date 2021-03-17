/**
 * 常用的菜单等数据
 * 不会经常变化，多出需要引用
 */
export const menu = [
  {
    icon: 'mdi-home-account',
    title: '个人主页',
    handler: {
      name: 'UserIndex',
    },
  },
  {
    icon: 'mdi-upload',
    title: '上传图片',
    handler: vm => {
      vm.$store.dispatch('upload/initUpload')
    },
  },
  {
    icon: 'mdi-account-cog',
    title: '设置',
    handler: {
      name: 'UserSetting',
    },
  },
  {
    icon: 'mdi-share-variant',
    title: '分享集',
    handler: {
      name: 'UserCollect',
    },
  },
  {
    icon: 'mdi-logout',
    title: '退出',
    handler: vm => {
      vm.$store.dispatch('auth/logout')
    },
  },
]
