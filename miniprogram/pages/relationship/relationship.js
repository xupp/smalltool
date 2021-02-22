var relationship = require('relationship.js/index.js')
import Toast from '../../libs/@vant/weapp/toast/toast'

Page({
  ships: [],
  data: {
    text: '',
    sex: 1,
    reverse: 1,
    size: {
      minHeight: 100,
      maxHeight: 100
    },
    ships: []
  },
  onChange(event) {
    this.setData({
      reverse: event.detail
    })
  },
  onSexChange(event) {
    this.setData({
      sex: event.detail
    })
  },
  onClickShip(event) {
    let text = event.currentTarget.dataset.text
    let ships = this.ships || []
    if (ships.length) {
      ships.push('的')
    }
    ships.push(text)
    this.setData({
      text: ships.join('')
    })
  },
  onClickOperate(event) {
    let index = event.currentTarget.dataset.index
    switch(index) {
      case 0:
        this.clickBack()
        break;
      case 1:
        this.clickClear()
        break;
      case 2:
        this.calcShip()
        break;
    }
  },
  clickBack() {
    let ships = this.ships
    if (!ships.length) {
      return
    } else if (ships.length === 1) {
      ships.splice(0, 1)
    } else {
      ships.splice(ships.length - 2, 2)
    }
    this.setData({
      text: ships.join(''),
      ships: []
    })
  },
  clickClear() {
    this.ships = []
    this.setData({
      text: '',
      ships: []
    })
  },
  calcShip() {
    this.setData({
      ships: []
    })
    let options = {
      text: this.data.text,
      sex: this.data.sex,	
      type: 'default',
      reverse: this.data.reverse === 2
    }
    let result = relationship(options)
    if (!result.length) {
      Toast('关系不存在')
      return
    }
    this.setData({
      ships: result
    })
  }
})