import {chooseImage} from '../../utils/util'
import Api from '../../models/api'
import Toast from '../../libs/@vant/weapp/toast/toast'

Page({
  data: {
    dialogShow: false,
    imageUrl: '',
    words_result: [],
    idcard_direction: 'front'
  },
  onChange(event) {
    this.setData({
      idcard_direction: event.detail
    })
  },
  onChooseImage(e) {
    const type = e.currentTarget.dataset.type
    chooseImage('serve').then(({file_name, img_stream}) => {
      this.orcImage(file_name, type)
      let t = type == 'net' ? 'normal': type
      this.setData({
        [`${t}_data`]: {
          img_stream
        }
      })
    })
  },
  onEditImageUrl() {
    this.setData({
      dialogShow: true
    })
  },
  bindTapConfirm(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      normal_data: {
        img_stream: this.data.imageUrl
      }
    })
    this.orcImage(this.data.imageUrl, type)
  },
  orcImage(file_name, type) {
    wx.showLoading({
      title: '识别中...',
      mask: true
    })
    Api.orcImage({
      file_name,
      type,
      idcard_direction: this.data.idcard_direction
    }).then(({words_result, result}) => {
      wx.hideLoading()
      let t = type == 'net' ? 'normal': type
      let r = words_result ? words_result : result ? result : null
      this.setData({
        [`${t}_words_result`]: r
      })
    }).catch(() => {
      wx.hideLoading()
      Toast('识别失败')
    })
  }
})