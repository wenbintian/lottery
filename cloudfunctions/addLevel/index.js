// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()
// collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
exports.main = async (event, context) => {
  return db.collection('each_game_tb').get()
}
