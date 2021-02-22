import { domain } from '../config/index.js'
import HTTP from '../libs/http.js'

const http = new HTTP()

export default class Api{
  static subway_image_url(city_code) {
    return `${domain}/static/map/${city_code}.jpg`
  }
  static decodeQrcode(data) {
    return http.request({
      url: '/tools/qrcode/decode',
      method: 'POST',
      data
    })
  }
  static createQrcode(data) {
    return http.request({
      url: '/tools/qrcode/create',
      method: 'POST',
      data
    })
  }
  static createWifiQrcode(data) {
    return http.request({
      url: '/tools/wifi_qrcode',
      method: 'POST',
      data
    })
  }
  static loadStation(city_code) {
    return http.request({
      url: `${domain}/static/json/${city_code}.json`
    })
  }
  static searchStationToStation({city, start, end}) {
    return http.request({
      url: `/subway/s_t_s?city=${city}&start=${start}&end=${end}`
    })
  }
  static loadSite({city, station_name}) {
    return http.request({
      url: `/subway/station?city=${city}&station_name=${station_name}`
    })
  }
  static generateImage(data) {
    return http.request({
      url: '/tools/cut_image',
      method: 'POST',
      data
    })
  }
  static loadEmotion() {
    return http.request({
      url: '/tools/doutu'
    })
  }
  static loadStories() {
    return http.request({
      url: '/tools/story'
    })
  }
  static orcImage(data) {
    return http.request({
      url: '/tools/orc_image',
      method: 'POST',
      data
    })
  }
  static loadAlbums() {
    return http.request({
      url: '/tools/album/list'
    })
  }
  static createAlbum(data) {
    return http.request({
      url: '/tools/album/create',
      method: 'POST',
      data
    })
  }
  static editAlbum(data) {
    return http.request({
      url: '/tools/album/edit',
      method: 'POST',
      data
    })
  }
  static editAlbumViewShare(data) {
    return http.request({
      url: '/tools/album/update_view_share',
      method: 'POST',
      data
    })
  }
  static deleteAlbum(id) {
    return http.request({
      url: `/tools/album/delete?id=${id}`
    })
  }
  static loadOneAlbum(id) {
    return http.request({
      url: `/tools/album?id=${id}`
    })
  }
  static loadTemplate() {
    return http.request({
      url: `${domain}/static/resources/template.json`
    })
  }
  static userLogin(data) {
    return http.request({
      url: '/user/update',
      method: 'POST',
      data
    })
  }
}