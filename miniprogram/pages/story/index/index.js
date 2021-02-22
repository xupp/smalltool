

const {domain} = require('../../../config/index')
const { default: Api } = require('../../../models/api')

Page({
  data: {
    domain: domain
  },
  onLoad() {
    this.loadStories()
  },
  loadStories() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    Api.loadStories().then(data => {
      wx.hideLoading()
      this.setData({
        stories: data
      })
    })
  },
  onClickItem(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../info/info',
      success: res => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  }
})