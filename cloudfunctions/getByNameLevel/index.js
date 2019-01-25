// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //通过 name 和 level 获取 数据 正常只获取一条
  let param={};
  if(event.name){
  	param.name = event.name;
  }
  if(event.level){
  	param.level = ""+event.level;
  }
  return db.collection('each_game_tb').where(param).orderBy("time","asc").get();
  


  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}