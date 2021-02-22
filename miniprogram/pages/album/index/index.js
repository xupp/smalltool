const { default: Api } = require("../../../models/api")

Page({
  data: {
    albums: []
  },
  onShow() {
    this.loadAlbums()
  },
  loadAlbums() {
    const albums = wx.getStorageSync('albums') || []
    if (!albums.length) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      Api.loadAlbums().then(data => {
        wx.hideLoading()
        this.setData({
          albums: data
        })
        wx.setStorageSync('albums', data)
      })
    } else {
      this.setData({
        albums
      })
    }
  },
  create() {
    wx.navigateTo({
      url: '../add/add?edit=true'
    })
  },
  open(e) {
    const item = e.currentTarget.dataset.item
    wx.setStorage({
      data: item,
      key: 'album_info',
      success: () => {
        wx.navigateTo({
          url: `../add/add?id=${item.id}`
        })
      }
    })
  },
  edit(e) {
    const item = e.currentTarget.dataset.item
    wx.setStorage({
      data: item,
      key: 'album_info',
      success: () => {
        wx.navigateTo({
          url: `../add/add?id=${item.id}&edit=true`
        })
      }
    })
  },
  del(e) {
    const {id, index} = e.currentTarget.dataset
    Api.deleteAlbum(id).then(() => {
      const albums = this.data.albums
      albums.splice(index, 1)
      this.setData({
        albums
      })
      wx.setStorageSync('albums', albums)
    })
  }
})