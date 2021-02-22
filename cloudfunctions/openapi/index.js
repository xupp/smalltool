// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'msgSecCheck': {
      return securityMsgSecCheck(event)
    }
    case 'imgSecCheck': {
      return securityImgSecCheck(event)
    }
    default: {
      return
    }
  }
}

async function securityMsgSecCheck(event) {
  let content = event.content
  try{
    const res = await cloud.openapi.security.msgSecCheck({
      content: content
    })
    return res
  } catch (err) {
    return err
  }
}

async function securityImgSecCheck(event) {
  let value = event.value
  try{
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        header: {
          'Content-Type': 'application/octet-stream'
        },
        contentType: 'image/png',
        value: Buffer.from(value)
      }
    })
    return res
  } catch (err) {
    return err
  }
}