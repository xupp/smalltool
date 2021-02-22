import button_data from '../../libs/calculator.js'

Page({
  data: {
    screen_text: '',
    btns: [],
    size: { maxHeight: 100, minHeight: 100 }
  },
  onLoad() {
    this.btn_d = button_data.create()
    this.setData({
      screen_text: this.btn_d.screen_text,
      btns: this.btn_d.btns
    })
  },
  click(event) {
    const index = event.currentTarget.dataset.index
    this.data.btns[index].onClick()
    this.setData({
      screen_text: this.btn_d.screen_text,
      'btns[0].text': this.btn_d.clear_btn.text
    })
  }
})