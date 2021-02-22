const {domain} = require('../../config/index')
Page({
  data: {
    list: [{
      title: '童话故事',
      img: `${domain}/static/resources/bg6.png`,
      url: '../story/index/index'
    },{
      title: '记个事',
      img: `${domain}/static/resources/bg5.png`,
      url: '../note/index/index'
    }, {
      title: '二维码',
      img: `${domain}/static/resources/bg7.png`,
      url: '../qrcode/qrcode'
    }, {
      title: '表情包',
      img: `${domain}/static/resources/bg2.png`,
      url: '../emotion/emotion'
    }, {
      title: '图文识别',
      img: `${domain}/static/resources/bg3.png`,
      url: '../orc/orc'
    }]
  }
})