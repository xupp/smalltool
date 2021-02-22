import HTTP from '../libs/http.js'

const http = new HTTP()

export default class Token {
  token_url = '/token'
  verify_token_url = '/token/verify'
  verify() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.getTokenFromServer()
    } else {
      this._verifyTokenFromServer(token)
    }
  }
  _verifyTokenFromServer(token) {
    http.request({
      url: this.verify_token_url,
      method: 'POST',
      data: {
        token
      }
    }).then(res => {
      if (!res.uid) {
        this.getTokenFromServer()
      }
    })
  }
  getTokenFromServer(cb) {
    wx.login({
      success: res => {
        http.request({
          url: this.token_url,
          method: 'POST',
          data: {
            account: res.code,
            type: 200
          }
        }).then(res => {
          wx.setStorageSync('token', res.token)
          cb && cb()
        })
      }
    })
  }
}