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
    icon: 'mdi-share-variant',
    title: '分享集',
    handler: {
      name: 'UserCollect',
    },
    children: [
      {
        title: '创建的',
        icon: 'mdi-file-upload',
        handle: '',
      },
      {
        title: '赞过',
        icon: 'mdi-thumb-up',
        handle: '',
      },
      {
        title: '收藏',
        icon: 'mdi-heart',
        handle: '',
      },
    ],
  },
  {
    icon: 'mdi-image-multiple',
    title: '图片',
    children: [
      {
        title: '上传的',
        icon: 'mdi-file-upload',
        handle: '',
      },
      {
        title: '赞过',
        icon: 'mdi-thumb-up',
        handle: '',
      },
      {
        title: '收藏',
        icon: 'mdi-heart',
        handle: '',
      },
    ],
  },
  {
    icon: 'mdi-account-cog',
    title: '设置',
    handler: {
      name: 'UserSetting',
    },
    children: [
      {
        icon: 'mdi-account-edit',
        title: '基本资料',
        handler: {
          name: 'UserSetting',
        },
      },
      {
        icon: 'mdi-shield-account',
        title: '安全设置',
      },
      {
        icon: 'mdi-account-lock',
        title: '隐私设置',
      },
    ],
  },
  {
    icon: 'mdi-logout',
    title: '退出',
    handler: vm => {
      vm.$store.dispatch('auth/logout')
    },
  },
]
