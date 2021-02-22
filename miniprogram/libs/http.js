import { encode } from 'js-base64'
import { base_url } from '../config/index'
import { Toast } from '../utils/util'

const patchUrl = url => {
  if (url.startsWith('http')) {
    return url
  }
  if (!base_url.endsWith('/') && !url.startsWith('/')) {
    return base_url + '/' + url
  }
  return base_url + url
}

export default class HTTP{
  defaultOptions = {
    method: 'GET',
    url: '',
    data: {},
    norefresh: true
  }
  request(options) {
    options = Object.assign({}, this.defaultOptions, options)
    if (!options.url.trim()) {
      throw new Error('请求地址不能为空！！！')
    }
    return new Promise((resolve, reject) => {
      this._request({...options, resolve, reject})
    })
  }
  _request({url, method, data, norefresh, resolve, reject} = options) {
    wx.request({
      url: patchUrl(url),
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': this._encode()
      },
      success: res => {
        const statusCode = res.statusCode.toString()
        if (statusCode.startsWith('2')) {
          resolve(res.data)
        } else {
          if (statusCode === '401') {
            if (norefresh) {
              this._refetch(options)
              return
            }
          }
          this._error_heandle(res.data.msg)
          reject()
        }
      },
      fail: err => {
        this._error_heandle(err.errMsg)
        reject()
      }
    })
  }
  _refetch(options) {
    const token = new Token()
    token.getTokenFromServer(() => {
      this._request(options)
    })
  }
  _error_heandle(msg) {
    Toast.fail(msg)
  }
  _encode() {
    const token = wx.getStorageSync('token')
    return 'Basic ' + encode(`${token}:`)
  }
}