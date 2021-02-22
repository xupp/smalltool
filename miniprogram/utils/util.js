import { upload_url } from '../config/index'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const uploadFile = (filePath, success, fail) => {
  const date = new Date()
  const file_name = date.getTime() + '' + date.getMilliseconds() + '.png'
  wx.uploadFile({
    url: upload_url,
    name: 'file',
    filePath,
    formData: {
      file_name
    },
    success: res => {
      if (res.statusCode == 200) {
        const data = JSON.parse(res.data || {})
        typeof success === 'function' && success({
          file_name,
          img_stream: data.img_stream
        })
      } else {
        typeof fail === 'function' && fail(res)
      }
    },
    fail: err => {
      typeof fail === 'function' && fail(err)
    }
  })
}

const chooseImage = (upload) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0]
        const temp = filePath.split('/')
        wx.cloud.init()
        wx.cloud.uploadFile({
          cloudPath: temp[temp.length - 1],
          filePath, 
          success: ({fileID}) => {
            imgSecCheck(fileID).then(() => {
              if (upload === 'serve') {
                uploadFile(filePath, resolve, reject)
              } else if (upload === 'cloud') {
                resolve(fileID)
              } else {
                resolve(filePath)
              }
            })
          },
          fail: console.error
        })
      },
      fail: reject
    })
  })
}

const toRadian = (angle) => {
  return angle * Math.PI / 180.0
}

const checkNearby = (lat1, lng1, lat2, lng2) => {
  var diffLat = Math.abs(lat1 - lat2)
  var diffLng = Math.abs(lng1 - lng2)
  var diff = diffLat + diffLng
  return diffLat < 0.03 && diffLng < 0.03 && diff < 0.03
}

const getDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = toRadian(lat1)
  var radLng1 = toRadian(lng1)
  var radLat2 = toRadian(lat2)
  var radLng2 = toRadian(lng2)
  var a = radLat1 - radLat2
  var b = radLng1 - radLng2
  var s = 2.0 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2.0), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2.0), 2)))
  s = s * 6378137.0
  s = Math.round(s)
  return s
}

function debounce(fn, wait) {
  var timeout = null
  return function() {
    if(timeout !== null) {
      clearTimeout(timeout)
    }
    var self = this
    var args = arguments
    timeout = setTimeout(function() {
      fn.apply(self, args)
    }, wait)
  }
}

const saveImageToPhotosAlbum = (filename, img_stream) => {
  return new Promise((resolve, reject) => {
    const fileSystem = wx.getFileSystemManager()
    const filePath = wx.env.USER_DATA_PATH + '/' + filename
    fileSystem.writeFile({
      filePath,
      data: img_stream,
      encoding: 'base64',
      success: () => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success: resolve,
          fail: reject
        })
      }, 
      fail: reject
    })
  })
}

const checkAuth = (auth) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting[auth]) {
          wx.authorize({
            scope: auth,
            success: resolve,
            fail: reject
          })
        } else {
          resolve()
        }
      },
      fail: reject
    })  
  })
}

const Toast = {
  success: msg => {
    wx.showToast({
      title: msg,
      mask: true
    })
  },
  fail: msg => {
    wx.showToast({
      title: msg || '',
      image: '/assets/images/error.png',
      mask: true
    })
  }
}

const msgSecCheck = (content) => {
  wx.cloud.init()
  return wx.cloud.callFunction({
    name: 'openapi',
    data: {
      action: 'msgSecCheck',
      content
    }
  }).then(res => {
    if (res.result && res.result.errCode == '87014') {
      wx.showModal({ title: '提示', content: '内容违规', showCancel: false, confirmText: '确定' })
      return Promise.reject()
    }
  })
}

const imgSecCheck = (filePath) => {
  wx.cloud.init()
  return wx.cloud.callFunction({
    name: 'openapi',
    data: {
      action: 'imgSecCheck',
      value: filePath
    }
  }).then(res => {
    if (res.result && res.result.errCode == '87014') {
      wx.showModal({ title: '提示', content: '图片违规', showCancel: false, confirmText: '确定' })
      return Promise.reject()
    }
  })
}

class AuthScope {
  static writePhotosAlbum = 'scope.writePhotosAlbum'
  static userInfo = 'scope.userInfo'
  static userLocation = 'scope.userLocation'
}



module.exports = {
  formatTime,
  uploadFile,
  chooseImage,
  checkNearby,
  getDistance,
  debounce,
  saveImageToPhotosAlbum,
  checkAuth,
  Toast,
  msgSecCheck,
  imgSecCheck,
  AuthScope
}
