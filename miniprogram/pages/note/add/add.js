const moment = require('moment/index.js')
const {msgSecCheck} = require('../../../utils/util.js')
const curDate = moment().format('YYYY-MM-DD')


Page({
  data: {
    title: '',
    categorys: ['生活', '纪念日', '工作', '其他'],
    category: '生活',
    curDate: curDate,
    loops: [{id: 0, name: '不循环'}, {id: 1, name: '每周'}, {id: 2, name: '每月'}, {id: 3, name: '每年'}],
    loop: {id: 0, name: '不循环'}
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', ({item, index}) => {
      if (item) {
        const {title, category, date, loop} = item
        this.setData({
          title,
          category,
          curDate: date,
          loop: this.data.loops[loop],
          edit: true,
          index,
          categoryIndex: this.data.categorys.findIndex(v => v == category),
          loopIndex: this.data.loops.findIndex(v => v == this.data.loops[loop])
        })
        wx.setNavigationBarTitle({
          title: '编辑事项'
        })
      }
    })
  },
  onInput(e) {
    if (this.data.errorMsg && e.detail.trim()) {
      this.setData({
        errorMsg: ''
      })
    }
  },
  bindCategoryChange(e) {
    this.setData({
      category: this.data.categorys[e.detail.value]
    })
  },
  bindDateChange(e) {
    this.setData({
      curDate: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      loop: this.data.loops[e.detail.value]
    })
  },
  onFinish() {
    let {title, category, curDate, loop} = this.data
    title = title.trim()
    if (!title) {
      this.setData({
        errorMsg: '请输入名称'
      })
      return
    }
    msgSecCheck(title)
    .then(() => {
      const item = {
        title,
        category,
        date: curDate,
        loop: loop.id
      }
      const notes = wx.getStorageSync('notes') || []
      if (this.data.edit) {
        notes.splice(this.data.index, 1, item)
      } else {
        notes.push(item)
      }
      wx.setStorageSync('notes', notes)
      wx.navigateBack({
        delta: 0
      })
    })
  },
  onCancel() {
    wx.navigateBack({
      delta: 0
    })
  },
  onDelete() {
    const notes = wx.getStorageSync('notes') || []
    notes.splice(this.data.index, 1)
    wx.setStorageSync('notes', notes)
    wx.navigateBack({
      delta: 0
    })
  }
})