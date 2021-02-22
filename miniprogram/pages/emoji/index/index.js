
import CanvasDrag from '../../../libs/wxa-comp-canvas-drag/canvas-drag/canvas-drag'
import { domain } from '../../../config/index'
import {msgSecCheck, chooseImage, saveImageToPhotosAlbum} from '../../../utils/util'
import Toast from '../../../libs/@vant/weapp/toast/toast'
const {} = require('../../../utils/util.js')


Page({
  data: {
    size: {
      minHeight: 36, 
      maxHeight: 36
    },
    text: '',
    graph: {},
    colors: ['rgb(0, 0, 0)', 'rgb(67, 67, 67)', 'rgb(102, 102, 102)', 'rgb(204, 204, 204)', 'rgb(217, 217, 217)', 'rgb(255, 255, 255)', 'rgb(152, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 255)', 'rgb(74, 134, 232)', 'rgb(0, 0, 255)', 'rgb(153, 0, 255)', 'rgb(255, 0, 255)', 'rgb(230, 184, 175)', 'rgb(244, 204, 204)', 'rgb(252, 229, 205)', 'rgb(255, 242, 204)', 'rgb(217, 234, 211)', 'rgb(208, 224, 227)', 'rgb(201, 218, 248)', 'rgb(207, 226, 243)', 'rgb(217, 210, 233)', 'rgb(234, 209, 220)', 'rgb(221, 126, 107)', 'rgb(234, 153, 153)', 'rgb(249, 203, 156)', 'rgb(255, 229, 153)', 'rgb(182, 215, 168)', 'rgb(162, 196, 201)', 'rgb(164, 194, 244)']
  },
  onShow() {
    wx.getStorage({
      key: 'select_materials',
      success: ({data}) => {
        if (data) {
          data.forEach(path => {
            wx.downloadFile({
              url: domain + path,
              success: ({tempFilePath}) => {
                this.addImg(tempFilePath)
              }
            })
          })
          wx.removeStorage({
            key: 'select_materials'
          })
        }
      }
    })
    // CanvasDrag.changeBgImage('../../../assets/images/timg.jpg')
  },
  addImg(url) {
    this.setData({
      graph: {
        type: 'image',
        w: 240,
        h: 200,
        url
      }
    })
  },
  addText(text) {
    this.setData({
      graph: {
        type: 'text',
        text
      }
    })
  },
  onClearCanvas() {
    this.setData({canvasBg:null})
    CanvasDrag.clearCanvas()
  },
  onUndo() {
    CanvasDrag.undo()
  },
  onCreate() {
    Toast({
      message: '长按保存',
      duration: 200,
      position: 'bottom',
      onClose: () => {
        CanvasDrag.export()
        .then((filePath) => {
          wx.previewImage({
            urls: [filePath]
          }, true)
        })
        .catch((e) => {
          console.error(e)
        })
      }
    })
  },
  onExport() {
    CanvasDrag.export()
    .then((filePath) => {
      saveImageToPhotosAlbum(new Date().getTime() + '.png',  wx.getFileSystemManager().readFileSync(filePath, 'base64'))
    })
    .catch((e) => {
      console.error(e)
    })
  },
  onClickImage() {
    this.setData({
      imgShow: true
    })
  },
  onClickBackground() {
    this.setData({
      bgShow: true
    })
  },
  onClickText() {
    this.setData({
      textShow: true
    })
  },
  onSelectColor(event) {
    let color = event.currentTarget.dataset.color
    if (this.data.textShow) {
      CanvasDrag.changFontColor(color)
    } else {
      CanvasDrag.changeBgColor(color)
    }
  },
  onClickConfirm() {
    msgSecCheck(this.data.text).then(() => {
      this.addText(this.data.text)
      this.setData({
        text: ''
      })
    })
  },
  onClickBgImage() {
    chooseImage().then(filePath => {
      CanvasDrag.changeBgImage(filePath)
    })
  },
  onClearBg() {
    CanvasDrag.changeBgColor('')
    CanvasDrag.changeBgImage('')
  },
  onClickCustomImage() {
    this.onClose()
    chooseImage().then(filePath => {
      this.addImg(filePath)
    })
  },
  onClickMaterial() {
    this.onClose()
    wx.navigateTo({
      url: '../material/material'
    })
  },
  onClose() {
    this.setData({
      imgShow: false,
      textShow: false,
      bgShow: false
    })
  }
})