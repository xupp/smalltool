import Api from '../../models/api'
import {chooseImage, saveImageToPhotosAlbum} from '../../utils/util'
import Toast from '../../libs/@vant/weapp/toast/toast'
Page({
  qrcodeContent: '',
  data: {
    dialogShow: false,
    wifiDialogShow: false,
    img_stream: '',
    radioShow: false,
    decode_text: '',
    textareaVal: '',
    checkboxVal: false,
    ssid: '',
    password: ''
  },
  createQrcode() {
    this.picture_name = ''
    this.colorized = ''
    this.setData({
      textareaVal: '',
      checkboxVal: false,
      radioShow: false,
      dialogShow: true,
      img_stream: '',
      decode_text: '',
      wifi_qrcode: false
    })
  },
  decodeQrcode() {
    this.setData({
      img_stream: '',
      decode_text: '',
      wifi_qrcode: false
    })
    chooseImage('serve').then(({file_name}) => {
      Api.decodeQrcode({
        file_name
      }).then(data => {
        this.setData({
          decode_text: decodeURIComponent(data)
        })
      })
    })
  },
  createWifiQrcode() {
    this.ssid = ''
    this.password = ''
    this.setData({
      wifiDialogShow: true,
      img_stream: '',
      decode_text: '',
      ssid: '',
      password: '',
      wifi_qrcode: false
    })
  },
  tapDialogButton() {
    if (!this.qrcodeContent.trim()) {
      Toast('请输入二维码内容')
      return
    }
    Api.createQrcode({
      words: encodeURIComponent(this.qrcodeContent),
      picture: this.picture_name || '',
      colorized: this.colorized || ''
    }).then(({img_stream}) => {
      this.setData({
        img_stream
      })
    })
  },
  tapWifiDialogButton() {
    const {ssid, password} = this
    if (!ssid.trim()) {
      Toast('请输入wifi名字')
      return
    }
    Api.createWifiQrcode({
      ssid,
      password
    }).then(data => {
      this.setData({
        wifi_qrcode: true,
        img_stream: data.img_stream
      })
    })
  },
  onChangeSSID(e) {
    this.ssid = e.detail
  },
  onChangePWD(e) {
    this.password = e.detail
  },
  onInputChange(e) {
    this.qrcodeContent = e.detail.value
  },
  onCheckboxChange(e) {
    if (e.detail.value.length) {
      chooseImage('serve').then(({file_name}) => {
        this.setData({
          radioShow: true
        })
        this.colorized = '1'
        this.picture_name = file_name
      }).catch(() => {
        this.setData({
          checkboxVal: false
        })
      })
    } else {
      this.setData({
        radioShow: false
      })
      this.colorized = ''
      this.picture_name = ''
    }
  },
  onRadioChange(e) {
    this.colorized = e.detail.value
  },
  saveImage(){
    saveImageToPhotosAlbum('qrcode.png', this.data.img_stream)
   },
   saveText() {
    wx.setClipboardData({
      data: this.data.decode_text
    })
   }
})