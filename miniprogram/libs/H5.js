const px_arr = ['width', 'height', 'left', 'top', 'right', 'bottom']

class H5 {
  constructor(){
    this.page = []
  }
  addPage(cfg={}){
    let page = {}
    page = Object.assign({}, page, cfg)
    page.list = []
    this.page.push(page)
    if (typeof this.addCommonComponent == 'function'){
      this.addCommonComponent()
    }
    return this
  }
  addComponent(cfg={}){
    let page = this.page.slice(-1)[0]
    let firstPage = this.page[0]
    let component = {}

    // 页面标题
    component.text = cfg.text ? cfg.text : ''

    // 元素父级样式
    component.elementStyle = ''
    if (cfg.width) {
      component.elementStyle += `width: ${cfg.width}px;`
    } 
    if (cfg.height) {
      component.elementStyle += `height: ${cfg.height}px;`
    } 
    if (typeof cfg.elementCss === 'object'){
      for (let [key, value] of Object.entries(cfg.elementCss)){
        if (key === 'left' && value === 'center') {
          component.elementStyle += `left: 50%;transform: translateX(-50%);`
        } else if (key === 'top' && value === 'center') {
          component.elementStyle += `top: 50%;transform: translateY(-50%);`
        } else {
          let unit = px_arr.includes(key) ? 'px' : ''
          component.elementStyle += `${key}: ${value}${unit};`
        }
      }
    }
    
    // 元素样式 -> bg
    component.animatedStyle = ''
    if (typeof cfg.animatedCss === 'object') {
      for (let [key, value] of Object.entries(cfg.animatedCss)) {
        let unit = px_arr.includes(key) ? 'px' : ''
        component.animatedStyle += `${key}: ${value}${unit};`
      }
    }

    //图片样式 -> img
    component.imgStyle = ''
    if (typeof cfg.img === 'object') {
      for (let [key, value] of Object.entries(cfg.img)) {
        if (key === 'src') {
          component.imageSrc = value
        } else {
          let unit = px_arr.includes(key) ? 'px' : ''
          component.imgStyle += `${key}: ${value}${unit};`
        }
      }
      if (!cfg.img.width) {
        component.imgStyle += `width: ${cfg.width}px;`
      }
      if (!cfg.img.height) {
        component.imgStyle += `height: ${cfg.height}px;`
      }
    }

    // 自定义事件
    if(cfg.bindTap) {
      component.bindTap = cfg.bindTap
    }

    // 自定义class
    if(cfg.class) {
      component.class = cfg.class
    }

    // 动画效果
    if(typeof cfg.animateIn === 'object') {
      const {name='', duration='1s', timing, delay, iteration, direction, mode} = cfg.animateIn
      let animate = `${name} ${duration} ${timing} ${delay} ${iteration} ${direction} ${mode}`
      component.animateIn = 'animation: ' + animate + ';'
      if (page == firstPage) {
        component.animatedStyle += 'animation: ' + animate + ';'
      }
      component.animateInName = cfg.animateIn.name
    }
    if (cfg.animateOut) {
      component.animateOut = cfg.animateOut
    }

    // 追加元素
    page.list.push(component)

    return this
  }
}

export default H5