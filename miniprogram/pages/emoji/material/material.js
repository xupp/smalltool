const {domain} = require('../../../config/index')
const {load_materials} = require('../../../data/material')
let all_materials

Page({
  items: [],
  active_index: [0, 0, 0, 0],
  data: {
    tab_active: 0,
    sub_tab_active: 0,
    tabs: [{
      name: '脸部',
      sub_tabs: ['卡通脸', '暴漫', '真人脸', '进击的兵长']
    },{
      name: '身体',
      sub_tabs: ['BONBON', '世界杯', '你懂的', '傻逗', '兔子', '刀剑枪药', '动漫', '包被子', '双人互动', '哭泣', '嗷大喵', '嚯哈', '圆脸', '坏坏', '小狮子', '彼尔德', '恶搞兔', '手臂', '杂项', '汪蛋', '熊猫人', '猥琐萌', '猫脸', '睡觉', '给跪', '罗罗布', '聚餐', '蘑菇头', '虎牙直播', '趴地小人', '趴着', '阿狮马', '黑暗势力']
    },{
      name: '吃鸡',
      sub_tabs: ['T恤', '冲锋枪', '卡宾枪', '头盔', '夹克', '子弹', '帽子', '手套', '手枪', '手雷', '散弹枪', '消耗品', '狙击步枪', '眼镜', '突击步枪', '精确步枪', '背包', '背心', '腰带', '裤子', '轻机枪', '近战武器', '配件弹夹', '配件弹药', '配件枪口', '配件镜头', '钥匙', '面具', '鞋子']
    },{
      name: '其他',
      sub_tabs: ['冷兵器', '发型', '圣诞', '帽子', '杂物', '武器', '水果', '物品', '眼镜', '花花', '项链', '饮料', '香烟']
    }],
    domain: domain
  },
  onShow() {
    all_materials = load_materials()
    this.setData({
      materials: all_materials[0][0]
    })
  },
  onTabChange(event) {
    let index = event.detail.index
    let materials = all_materials[index][this.active_index[index]]
    this.setData({
      tab_active: index,
      sub_tab_active: this.active_index[index],
      materials
    })
  },
  onSubTabChange(event) {
    let index = event.detail
    let materials = all_materials[this.data.tab_active][index]
    this.setData({
      sub_tab_active: index,
      materials
    })
    this.active_index[this.data.tab_active] = index
  },
  onClickItem(event) {
    let path = event.currentTarget.dataset.path
    let index = event.currentTarget.dataset.index
    this.items.push(path)
    this.data.materials[index]['num'] = all_materials[this.data.tab_active][this.data.sub_tab_active][index]['num'] = this.items.filter(v => v === path).length
    this.setData({
      materials: this.data.materials
    })
  },
  onClickRemove(event) {
    let path = event.currentTarget.dataset.path
    let index = event.currentTarget.dataset.index
    this.items = this.items.filter(v => v !== path)
    this.data.materials[index]['num'] = all_materials[this.data.tab_active][this.data.sub_tab_active][index]['num'] = 0
    this.setData({
      materials: this.data.materials
    })
  },
  onClickSave() {
    wx.setStorage({
      data: this.items,
      key: 'select_materials',
      success: () => {
        wx.navigateBack({
          delta: 0
        })
      }
    })
  }
})