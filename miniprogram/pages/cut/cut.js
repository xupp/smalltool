const { default: Api } = require('../../models/api')
import {chooseImage, checkAuth, AuthScope, saveImageToPhotosAlbum} from '../../utils/util'
import Toast from '../../libs/@vant/weapp/toast/toast'

Page({
  data: {
    radio: 9,
    columnNum: 3,
    img_streams: new Array(9)
  },
  onChange(event) {
    const radio = event.detail
    this.setData({
      radio,
      columnNum: Math.sqrt(radio),
      img_streams: new Array(radio)
    })
  },
  onClickChooseImage() {
    chooseImage('serve').then(({file_name}) => {
      wx.showLoading({
        mask: true
      })
      Api.generateImage({
        file_name,
        number: this.data.radio
      }).then(data => {
        wx.hideLoading()
        this.setData({
          img_streams: data
        })
      }).catch(() => {
        wx.hideLoading()
      })
    })
  },
  onExportImage() {
    checkAuth(AuthScope.writePhotosAlbum).then(() => {
      const promises = this.data.img_streams.map((stream, index) => saveImageToPhotosAlbum(`${index + 1}.png`, stream))
      Promise.all(promises).then(() => {
        Toast('保存成功')
      }).catch(() => {
        Toast('保存失败')
      })
    })
  }
})