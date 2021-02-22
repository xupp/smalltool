import { domain } from '../../config/index.js'
import HTTP from '../../libs/http.js'
import Api from '../../models/api.js'
import {checkAuth, AuthScope} from '../../utils/util'


const http = new HTTP()

Page({
  data: {
    authorized: false,
    userInfo: {}
  },
  onShow() {
    this._verifyUserAuthorized()
  },
  _verifyUserAuthorized() {
    checkAuth(AuthScope.userInfo).then(() => {
      wx.getUserInfo({
        success: ({userInfo}) => {
          this.setData({
            authorized: true,
            userInfo
          })
        }
      })
    })
  },
  onGetUserInfo(event) {
    if (event.detail.errMsg !== 'getUserInfo:ok') {
      return
    }
    const userInfo = event.detail.userInfo
    this.setData({
      authorized: true,
      userInfo: userInfo
    })
    wx.login({
      success: res => {
        wx.getUserInfo({
          success: data => {
            this.setData({
              authorized: true,
              userInfo: data.userInfo
            })
            Api.userLogin({
              encryptedData: data.encryptedData,
              iv: data.iv,
              code: res.code,
              userInfo: JSON.stringify(userInfo)
            })
          }
        })
      }
    })
  },
  onSupport() {
    wx.previewImage({
      urls: [`${domain}/static/resources/support.png`]
    })
  },
  onShareAppMessage() {
    return {
      title: '有用小帮手',
      path: '/pages/index/index',
      imageUrl: '/assets/images/index.png'
    }
  }
})