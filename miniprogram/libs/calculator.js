import NP from 'number-precision'

class Button {
  constructor(text) {
    this.text = text
  }
}

class NumberButton extends Button {
  onClick = function () {
    if (typeof button_data.nums[0] === 'number') {
      if (this.text == '.') {
        button_data.nums.splice(0, button_data.nums.length, '0', '.')
      } else {
        button_data.nums.splice(0, button_data.nums.length)
      }
    }
    if (button_data.uniqueZero) {
      if (/[1-9]/.test(this.text)) {
        button_data.nums.splice(0, 1, this.text)
      } else if (this.text === '.') {
        button_data.nums.push(this.text)
      }
    } else {
      if (button_data.numsHasDot && this.text === '.') {
        return
      }
      button_data.nums.push(this.text)
    }
  }
}

class ClearButton extends Button {
  onClick = function () {
    button_data.nums.splice(0, button_data.nums.length, '0')
    button_data.nums_operates = []
  }
}

class SignButton extends Button {
  onClick = function () {
    if (button_data.isMinusSign) {
      button_data.nums[0] = '' + Math.abs(button_data.nums[0])
    } else {
      button_data.nums[0] = '-' + button_data.nums[0]
    }
  }
}

class PercentButton extends Button {
  onClick = function () {
    let result
    if (button_data.nums.length) {
      result = parseFloat(button_data.nums.join(''))
    } else if (button_data.lastIsOperate) {
      result = button_data.nums_operates.splice(button_data.nums_operates.length - 2, 1)
    }
    result = NP.round(NP.divide(result, 100), 2)
    button_data.nums.splice(0, button_data.nums.length, result)
  }
}

class OperateButton extends Button {
  onClick = function () {
    switch (this.text) {
      case '+':
        this.calc('plus')
        break
      case '-':
        this.calc('minus')
        break
      case '×':
        this.calc('times')
        break
      case '÷':
        this.calc('divide')
        break
    }
  }
  calc = function (operate) {
    const curr_num = parseFloat(button_data.nums.join(''))
    const condition_func = function() {
      if (button_data.divideZero) {
        return
      }
      operate = button_data.nums_operates[3] === '×' ? 'times' : 'divide'
      result = NP[operate](button_data.nums_operates[2], curr_num)
      if (this.text === '+' || this.text === '-') {
        operate = button_data.nums_operates[1] === '+' ? 'plus' : 'minus'
        result = NP[operate](button_data.nums_operates[0], result)
        button_data.nums_operates.splice(0, button_data.nums_operates.length, result, this.text)
      } else {
        button_data.nums_operates[2] = result
        button_data.nums_operates[3] = this.text
      }
      button_data.nums.splice(0, button_data.nums.length, result)
    }
    if (button_data.nums_operates.includes(this.text)) {
      let result
      if (button_data.nums_operates[3] === '×' || button_data.nums_operates[3] === '÷') {
        condition_func()
      } else {
        if (button_data.divideZero) {
          return
        }
        result = NP[operate](button_data.nums_operates[0], curr_num)
        button_data.nums_operates.splice(0, button_data.nums_operates.length, result, this.text)
        button_data.nums.splice(0, button_data.nums.length, result)
      }
    } else {
      if (!button_data.isOperateByIndex(1)) {
        button_data.nums_operates[0] = curr_num
        button_data.nums_operates[1] = this.text
        button_data.nums.splice(0, button_data.nums.length, curr_num)
      } else {
        if (button_data.nums_operates[3] === '×' || button_data.nums_operates[3] === '÷') {
          condition_func()
        } else {
          if (this.text === '×' || this.text === '÷') {
            button_data.nums_operates[2] = curr_num
            button_data.nums_operates[3] = this.text
            button_data.nums.splice(0, button_data.nums.length, curr_num)
          } else {
            if (button_data.divideZero) {
              return
            }
            operate = button_data.getOperate(button_data.nums_operates[1])
            const result = NP[operate](button_data.nums_operates[0], curr_num)
            button_data.nums_operates.splice(0, button_data.nums_operates.length, result, this.text)
            button_data.nums.splice(0, button_data.nums.length, result)
          }
        }
      }
    }
  }
}

class CalcButton extends Button {
  onClick = function () {
    if (button_data.nums_operates.length !== 2 && button_data.nums_operates.length !== 4) {
      return
    }
    const curr_num = parseFloat(button_data.nums.join(''))
    let operate
    let result
    if (button_data.nums_operates[3] === '×' || button_data.nums_operates[3] === '÷') {
      if (button_data.divideZero) {
        return
      }
      operate = button_data.nums_operates[3] === '×' ? 'times' : 'divide'
      result = NP[operate](button_data.nums_operates[2], curr_num)
      operate = button_data.nums_operates[1] === '+' ? 'plus' : 'minus'
      result = NP[operate](button_data.nums_operates[0], result)
    } else {
      if (button_data.divideZero) {
        return
      }
      operate = button_data.getOperate(button_data.nums_operates[1])
      result = NP[operate](button_data.nums_operates[0], curr_num)
    }
    button_data.nums_operates.splice(0, button_data.nums_operates.length, result)
    button_data.nums.splice(0, button_data.nums.length, result)
  }
}

const button_data = {
  operates: ['+', '-', '×', '÷'],
  nums_operates: [],
  get uniqueZero() {
    return this.nums.length === 1 && this.nums[0] === '0' ? true : false
  },
  get numsHasDot() {
    return this.nums.includes('.')
  },
  get lastIsOperate() {
    return this.isOperateByIndex(this.nums_operates.length - 1)
  },
  get isMinusSign() {
    return this.nums.findIndex(v => '-' + Math.abs(v) == v) === 0
  },
  get screen_text() {
    return NP.strip(this.nums.join(''))
  },
  get divideZero() {
    return parseFloat(this.nums.join('')) === 0 && (button_data.nums_operates[3] === '÷' || button_data.nums_operates[1] === '÷')
  },
  isOperateByIndex(index) {
    return this.operates.includes(this.nums_operates[index])
  },
  getOperate(text) {
    let operate
    switch (text) {
      case '+':
        operate = 'plus'
        break
      case '-':
        operate = 'minus'
        break
      case '×':
        operate = 'times'
        break
      case '÷':
        operate = 'divide'
        break
    }
    return operate
  },
  create() {
    const self = this
    const clear_btn = new ClearButton('AC')
    this.clear_btn = clear_btn
    function watch_change() {
      if (!self.uniqueZero) {
        if (clear_btn.text === 'AC') {
          clear_btn.text = 'C'
        }
      } else {
        if (clear_btn.text === 'C' && !button_data.lastIsOperate) {
          clear_btn.text = 'AC'
        }
      }
    }
    function NewArray(...args) {
      return Array.prototype.push.apply(this, args)
    }
    NewArray.prototype = Object.create(Array.prototype)
    NewArray.prototype.push = function (...args) {
      Array.prototype.push.apply(this, args)
      watch_change()
    }
    NewArray.prototype.splice = function (start, deleteCount, ...args) {
      Array.prototype.splice.call(this, start, deleteCount, ...args)
      watch_change()
    }
    this.nums = new NewArray('0')
    this.btns = [
      clear_btn,
      new SignButton('+/-'),
      new PercentButton('%'),
      new OperateButton('÷'),
      new NumberButton('7'),
      new NumberButton('8'),
      new NumberButton('9'),
      new OperateButton('×'),
      new NumberButton('4'),
      new NumberButton('5'),
      new NumberButton('6'),
      new OperateButton('-'),
      new NumberButton('1'),
      new NumberButton('2'),
      new NumberButton('3'),
      new OperateButton('+'),
      new NumberButton('0'),
      new NumberButton('.'),
      new CalcButton('=')
    ]
    return this
  }
}

export default button_data