// 引入SDK核心类
var QQMapWX = require('./libs/qqmap-wx-jssdk.min')
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'S6RBZ-IK7C6-ECNS6-M3VFR-MBM37-4SFYP' // 必填
})

import Token from './models/token'

App({
  onLaunch: () => {
    const token = new Token()
    token.verify()
  },
  setNavigationBarTitle: title => wx.setNavigationBarTitle({
    title
  }),
  globalData: {
    userInfo: null,
    qqmapsdk
  }
})