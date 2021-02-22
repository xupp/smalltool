
import NP from 'number-precision'
const moment = require('moment/index.js')

Page({
  data: {
    type: 'days',
    notes: []
  },
  onLoad() {
    this.pastTime()
  },
  onShow() {
    this.loadNotes()
  },
  pastTime() {
    let year = moment().year()
    let startTime = moment().format('YYYY-MM-DD')
    let endTime = `${year + 1}-01-01`
    let lastDays = moment(endTime).diff(moment(startTime), 'days')
    let allDays = moment(endTime).diff(moment(`${year}-01-01`), 'days')
    let percent = NP.times(NP.round(NP.divide(NP.minus(allDays, lastDays), allDays), 2), 100)
    this.setData({
      percent
    })
  },
  loadNotes() {
    let curDate = moment().format('YYYY-MM-DD')
    let notes = wx.getStorageSync('notes') || []
    notes = notes.map(item => {
      item.new_date = item.date
      if (moment(item.date).isBefore(curDate)) {
        if (item.loop == 0) {
          item.expires = true
          item.text = '已过'
        } else {
          let day = item.loop == 1 ? 7 : item.loop == 2 ? 30 : 365
          let i = 1
          let endTime = moment(item.date).add(day * i, 'days')
          while(endTime.isBefore(curDate)) {
            i++
            endTime = moment(item.date).add(day * i, 'days')
          }
          item.new_date = endTime.format('YYYY-MM-DD')
          let lastDays = moment(endTime).diff(moment(curDate), 'days')
          item.text = `${lastDays}天`
          if (this.data.type == 'weeks' && lastDays >= 7) {
            let week = Math.floor(lastDays / 7)
            let days = lastDays % 7
            item.text = `${week}周${days}天`
          }
        }
      } else {
        let lastDays = moment(item.date).diff(moment(curDate), 'days')
        item.text = `${lastDays}天`
        if (this.data.type == 'weeks' && lastDays >= 7) {
          let week = Math.floor(lastDays / 7)
          let days = lastDays % 7
          item.text = `${week}周${days}天`
        }
      }
      return item
    })
    let noExpiresNotes = notes.filter(v => !v.expires)
    let expiresNotes = notes.filter(v => v.expires)
    noExpiresNotes.sort((a, b) => moment(a.new_date).valueOf() - moment(b.new_date).valueOf())
    notes = noExpiresNotes.concat(expiresNotes)
    this.setData({
      notes
    })
  },
  onChangeType(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    }, () => {
      this.loadNotes()
    })
  },
  addNote(e) {
    const {item, index} = e.currentTarget.dataset
    if (e.detail == 'right') {
      const notes = wx.getStorageSync('notes') || []
      notes.splice(index, 1)
      wx.setStorageSync('notes', notes)
      this.setData({
        notes
      })
    } else {
      wx.navigateTo({
        url: '../add/add',
        success: res => {
          res.eventChannel.emit('acceptDataFromOpenerPage', { item: item, index: index })
        }
      })
    }
  }
})