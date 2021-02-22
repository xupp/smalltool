// components/page-scroll/page-scroll.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperData: {
      type: Array,
      value: []
    },
    pageConfig: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    change(e) {
      const preIndex = this.preIndex || 0
      const currentIndex = e.detail.current
      const swiperData = this.data.swiperData
      for (let [key, value] of Object.entries(swiperData[preIndex].list)) {
        value.animatedStyle = value.animatedStyle.replace(value.animateInName, value.animateOut)
      }
      for (let [key, value] of Object.entries(swiperData[currentIndex].list)) {
        if (!value.animatedStyle) {
          value.animatedStyle = value.animateIn
        } else {
          value.animatedStyle = value.animatedStyle.replace(value.animateOut, value.animateInName)
        }
      }
      this.setData({
        swiperData
      })
      this.preIndex = currentIndex
      this.triggerEvent('change', e.detail.current)
    },
    chooseImg(e) {
      this.triggerEvent('chooseImg', e.currentTarget.dataset)
    }
  }
})
