import H5 from '../../../libs/H5'
import Api from '../../../models/api'
import Toast from '../../../libs/@vant/weapp/toast/toast'
import {chooseImage} from '../../../utils/util'
const {domain} = require('../../../config/index')

const h5 = new H5()
let cb = () => {}

Page({
  data: {
    edit: false,
    templateShow: false,
    musicShow: false,
    configShow: false,
    bgShow: false,
    domain: domain,
    templates: [],
    pages: [],
    pageConfig: {
      musicUrl: '',
      playMusic: true,
      autoplay: true, 
      circular: true,
      indicatorDots: true,
      current: 0,
      title: '',
      thumb: '',
      view: 0,
      share: 0
    },
    musics: [{
      name: 'Time Together',
      src: `${domain}/static/resources/d9cdb0b517d0a0be506120a298d68800.mp3`
    },{
      name: '今夜不失眠的催眠曲',
      src: `${domain}/static/resources/a1c9839b0292379657963d2f18517554.mp3`
    },{
      name: 'Sign You To Sleep',
      src: `${domain}/static/resources/01dbc4b66e10447da127cf4a09ba2505.mp3`
    },{
      name: '我多喜欢你，你会知道',
      src: `${domain}/static/resources/a8fd6ef120be4e9388baaef6967d2d68.mp3`
    },{
      name: '为了第一次恋爱的恋人们',
      src: `${domain}/static/resources/02ce1b83ea4a57cc24a74a0a646cb6f3.mp3`
    }],
    colors: ['rgb(0, 0, 0)', 'rgb(67, 67, 67)', 'rgb(102, 102, 102)', 'rgb(204, 204, 204)', 'rgb(217, 217, 217)', 'rgb(255, 255, 255)', 'rgb(152, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 255)', 'rgb(74, 134, 232)', 'rgb(0, 0, 255)', 'rgb(153, 0, 255)', 'rgb(255, 0, 255)', 'rgb(230, 184, 175)', 'rgb(244, 204, 204)', 'rgb(252, 229, 205)', 'rgb(255, 242, 204)', 'rgb(217, 234, 211)', 'rgb(208, 224, 227)', 'rgb(201, 218, 248)', 'rgb(207, 226, 243)', 'rgb(217, 210, 233)', 'rgb(234, 209, 220)', 'rgb(221, 126, 107)', 'rgb(234, 153, 153)', 'rgb(249, 203, 156)', 'rgb(255, 229, 153)', 'rgb(182, 215, 168)', 'rgb(162, 196, 201)', 'rgb(164, 194, 244)'],
    paused: true,
    swiperData: []
  },
  onShow() {
    console.log(this.data.pageConfig)
    const {musicUrl, playMusic} = this.data.pageConfig
    if (musicUrl && playMusic) {
      cb = paused => {
        this.setData({
          paused 
        })
      }
      if (this.innerAudioContext && this.innerAudioContext.paused) {
        this.innerAudioContext.play()
      }
    }
  },
  onLoad(options) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.loop = true
    this.innerAudioContext.onPlay(() => cb(this.innerAudioContext.paused))
    this.innerAudioContext.onPause(() => cb(this.innerAudioContext.paused))
    if (options.edit) {
      this.setData({
        edit: true
      })
    }
    if (options.id) {
      this.id = options.id
      this.loadPage()
    }
    this.loadTemplate()
  },
  loadTemplate() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    Api.loadTemplate().then(data => {
      wx.hideLoading()
      this.setData({
        templates: data
      })
    })
  },
  loadPage() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.getStorage({
      key: 'album_info',
      success: ({data}) => {
        wx.hideLoading()
        this.setData({
          swiperData: data._pages,
          pageConfig: data._pageConfig,
          currentIndex: this.data.pageConfig.current
        })
        this.render()
      },
      fail: () => {
        Api.loadOneAlbum(this.id).then(data => {
          wx.hideLoading()
          wx.setStorage({
            data,
            key: 'album_info'
          })
          this.setData({
            swiperData: data._pages,
            pageConfig: data._pageConfig,
            currentIndex: this.data.pageConfig.current
          })
          this.render()
        })
      }
    })
  },
  render() {
    if (this.id && !this.data.edit) {
      this.data.pageConfig.view += 1
      this.setData({
        pageConfig: this.data.pageConfig
      })
      this.updateViewShare()
    }
    const {musicUrl, playMusic} = this.data.pageConfig
    if (musicUrl && playMusic) {
      cb = paused => {
        this.setData({
          paused 
        })
      }
      this.innerAudioContext.src = musicUrl
      this.innerAudioContext.play()
    }
  },
  bindSelectTemplate() {
    this.setData({
      templateShow: true
    })
  },
  bindSelectMusic() {
    this.setData({
      musicShow: true
    })
  },
  onCloseMusicPopup() {
    this.setData({
      musicShow: false
    })
  },
  bindOpenSetting() {
    this.setData({
      configShow: true
    })
  },
  onCloseConfigPopup() {
    this.setData({
      configShow: false
    })
  },
  bindSettingBackground() {
    this.setData({
      bgShow: true,
      curIndex: this.data.currentIndex
    })
  },
  onCloseBgPopup() {
    this.setData({
      bgShow: false
    })
  },
  onClose() {
    this.setData({ 
      templateShow: false 
    })
    for(let page of this.data.templates) {
      if (page.checked) {
        h5.addPage(page)
        if (page.components && page.components.length) {
          for (let component of page.components) {
            h5.addComponent(component)
          }
        }
        page.checked = false
      }
    }
    const swiperData = this.data.swiperData.concat(h5.page)
    this.setData({
      templates: this.data.templates,
      swiperData: swiperData
    })
    h5.page = []
  },
  onClickItem(event) {
    const index = event.currentTarget.dataset.index
    this.data.templates[index]['checked'] = true
    this.setData({
      templates: this.data.templates
    })
  },
  onClickRemove(event) {
    const index = event.currentTarget.dataset.index
    this.data.templates[index]['checked'] = false
    this.setData({
      templates: this.data.templates
    })
  },
  onPageChange(e) {
    this.setData({
      currentIndex: e.detail
    })
  },
  onChooseImg(e) {
    const {pageindex, componentindex} = e.detail
    if (this.data.edit) {
      chooseImage('cloud').then(fileID => {
        this.data.swiperData[pageindex].list[componentindex].imageSrc = fileID  //`${domain}/static/uploads/${file_name}`
        this.setData({
          swiperData: this.data.swiperData
        })
      })
    } else {
      wx.previewImage({
        urls: [this.data.swiperData[pageindex].list[componentindex].imageSrc],
      })
    }
  },
  bindDelPage() {
    const idx = this.data.currentIndex
    const swiperData = this.data.swiperData
    swiperData.splice(idx, 1)
    this.setData({
      swiperData,
      ['pageConfig.current']: idx ? idx - 1 : 0
    })
  },
  onPlay(e) {
    const index = e.currentTarget.dataset.index
    const music = this.data.musics[index]
    cb = paused => {
      const musics = this.data.musics.map((item, idx) => {
        if (idx === index) {
          item.paused = paused
        } else {
          item.paused = true
        }
        return item
      })
      this.setData({
        musics
      })
    }
    if (this.currentIndex != index) {
      this.innerAudioContext.src = music.src
      this.innerAudioContext.play()
      this.currentIndex = index
    } else {
      if (!music.paused) {
        this.innerAudioContext.pause()
      } else {
        this.innerAudioContext.play()
      }
    }
  },
  onSelectMusic(e) {
    const src = e.currentTarget.dataset.src
    this.setData({
      ['pageConfig.musicUrl']: src
    })
    
    const {musicUrl, playMusic} = this.data.pageConfig
    if (musicUrl && playMusic) {
      cb = paused => {
        this.setData({
          paused 
        })
      }
      if (this.innerAudioContext) {
        this.innerAudioContext.src = src
        this.innerAudioContext.play()
      }
    }
    this.onCloseMusicPopup()
  },
  bindPauseMusic() {
    cb = paused => {
      this.setData({
        paused 
      })
    }
    if (!this.data.paused) {
      this.innerAudioContext.pause()
    } else {
      this.innerAudioContext.play()
    }
  },
  onClickSetting(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [`pageConfig.${key}`]: !this.data.pageConfig[key]
    })
  },
  bindCurrentChange(e) {
    const current = parseInt(e.detail.value)
    this.setData({
      ['pageConfig.current']: current
    })
  },
  onSetPageThumb() {
    chooseImage('cloud').then(fileID => {
      this.setData({
        ['pageConfig.thumb']: fileID //`${domain}/static/uploads/${file_name}`
      })
    })
  },
  onTitleChange(e) {
    this.setData({
      ['pageConfig.title']: e.detail
    })
  },
  onSetPageBgImg() {
    const idx = this.data.currentIndex
    const swiperData = this.data.swiperData
    swiperData[idx].useBgImg = true
    swiperData[idx].useBgColor = false
    chooseImage('serve').then(({file_name}) => {
      swiperData[idx].bgImg = `${domain}/static/uploads/${file_name}`
      this.setData({
        swiperData
      })
    })
  },
  onSetPageBgColor() {
    const idx = this.data.currentIndex
    const swiperData = this.data.swiperData
    swiperData[idx].useBgImg = false
    swiperData[idx].useBgColor = true
    this.setData({
      swiperData
    })
  },
  onSelectPageColor(e) {
    const color = e.currentTarget.dataset.color
    const idx = this.data.currentIndex
    const swiperData = this.data.swiperData
    swiperData[idx].bgColor = color
    this.setData({
      swiperData
    })
  },
  onClearPageBg() {
    const idx = this.data.currentIndex
    const swiperData = this.data.swiperData
    swiperData[idx].useBgImg = false
    swiperData[idx].useBgColor = false
    this.setData({
      swiperData
    })
  },
  bindSave() {
    const {swiperData, pageConfig} = this.data
    const albums = wx.getStorageSync('albums') || []
    if (this.id) {
      if (!pageConfig.title.trim()) {
        pageConfig.title = `音乐相册 #${this.id}`
      }
      Api.editAlbum({
        id: this.id,
        pages: swiperData,
        pageConfig
      }).then(({_pages, _pageConfig}) => {
        let index = albums.findIndex(v => v.id == this.id)
        albums[index]._pages = _pages
        albums[index]._pageConfig = _pageConfig
        wx.setStorageSync('albums', albums)
        Toast({
          message: '保存成功',
          onClose: () => {
            wx.navigateBack({
              delta: 0
            })
          }
        })
      })
    } else {
      if (!pageConfig.title.trim()) {
        pageConfig.title = `音乐相册${albums.length + 1}`
      }
      Api.createAlbum({
        pages: swiperData,
        pageConfig
      }).then(data => {
        albums.push(data)
        wx.setStorageSync('albums', albums)
        Toast({
          message: '保存成功',
          onClose: () => {
            wx.navigateBack({
              delta: 0
            })
          }
        })
      })
    }
  },
  updateViewShare() {
    const albums = wx.getStorageSync('albums') || []
    Api.editAlbumViewShare({
      id: this.id,
      pageConfig: this.data.pageConfig
    }).then(({_pageConfig}) => {
      let index = albums.findIndex(v => v.id == this.id)
      albums[index]._pageConfig = _pageConfig
      wx.setStorageSync('albums', albums)
    })
  },
  onUnload() {
    this.innerAudioContext.destroy()
    wx.removeStorage({
      key: 'album_info'
    })
  },
  async onShareAppMessage() {
    let {id, _pageConfig: {title}} = await new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'album_info',
        success: ({data}) => {
          resolve(data)
        }
      })
    })
    return {
      title,
      path: `/pages/album/add/add?id=${id}`,
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
          this.data.pageConfig.share += 1
          this.setData({
            pageConfig: this.data.pageConfig
          })
          this.updateViewShare()
        }
      },
    }
  }
})