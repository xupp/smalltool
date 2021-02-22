import NP from 'number-precision'
const {domain} = require('../../../config/index')

const app = getApp()

Page({
  data: {
    domain: domain,
    currentValue: 0,
    isplay: true,
    currentTime: '0:0',
    duration: '0:0'
  },
  onShow() {
    if (this.innerAudioContext && this.innerAudioContext.paused) {
      this.innerAudioContext.play()
      this.setData({
        isplay: true
      })
    }
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', ({data}) => {
      this.setData({
        ...data
      })
      const {title, category, mp3} = data
      app.setNavigationBarTitle(title)
      const innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext = innerAudioContext
      innerAudioContext.src = `${domain}/static/story/mp3/${category}/${mp3}`
      innerAudioContext.autoplay = true
      innerAudioContext.onTimeUpdate(() => {
        const duration = NP.round(innerAudioContext.duration, 0)
        const currentTime = NP.round(innerAudioContext.currentTime, 0)
        this.setData({
          duration,
          currentTime,
          currentValue: NP.round(NP.times(NP.divide(currentTime, duration), 100), 0)
        })
      })
      innerAudioContext.onSeeking((res) => {
        if (!innerAudioContext.paused) {
          innerAudioContext.pause()
          this.setData({ 
            isplay: false
          })
        }
      })
      innerAudioContext.onSeeked(() => {
        innerAudioContext.play()
        this.setData({
          isplay: true
        })
      })
      innerAudioContext.onEnded(() => {
        this.setData({
          isplay: false
        })
      })
    })
  },
  onDrag(event) {
    const currentValue = event.detail.value
    const currentTime = NP.round(NP.divide(NP.times(this.data.duration, currentValue), 100), 0)
    this.innerAudioContext.seek(currentTime)
    this.setData({
      currentValue,
      currentTime
    })
  },
  onPlay() {
    if (this.data.isplay) {
      this.innerAudioContext.pause()
      this.setData({ 
        isplay: false
      })
    } else {
      this.innerAudioContext.play()
      this.setData({ 
        isplay: true 
      })
    }
  },
  onHide() {
    // this.innerAudioContext.destroy()
  },
  onUnload() {
    this.innerAudioContext.destroy()
  }
})