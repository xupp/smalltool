

const {domain} = require('../../config/index')
const { default: Api } = require('../../models/api')

Page({
  data: {
    domain: domain
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    Api.loadEmotion().then(data => {
      wx.hideLoading()
      this.tempData = data
      this.loadEmotion(0)
    })
  },
  onTabChange(e) {
    this.loadEmotion(e.detail.index)
  },
  loadEmotion(index) {
    let data = this.tempData
    let f = Object.keys(data)[index]
    this.keys = this.keys || []
    this.keys.push(f)
    let temp = {}
    for (let p in data) {
      if (this.keys.includes(p)) {
        temp[p] = data[p]
      } else {
        temp[p] = []
      }
    }
    this.setData({
      all_images: temp
    })
  },
  onClickItem(e) {
    let _image_urls = e.currentTarget.dataset.item._image_urls
    let urls = _image_urls.map(v => `${domain}/static/emoji/${v}`)
    wx.previewImage({
      urls
    })
  }
})