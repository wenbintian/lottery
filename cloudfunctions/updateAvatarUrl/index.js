const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()
// 更新 avatarUrl字段
exports.main = async (event, context) => {
  let openId = cloud.getWXContext().OPENID;
  return db.collection('each_game_tb').where({ _openid: openId })
    .update({
      data: {
        avatarUrl: event.avatarUrl
      }
    });
}
