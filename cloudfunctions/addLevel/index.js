// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()
// 添加一条记录
exports.main = async (event, context) => {

	if(event.dbType=="add"){
		return db.collection('each_game_tb').add({
			data: { 
			  level: ""+event.level,
			  name: event.name,
			  time: event.time,
			  _openid: cloud.getWXContext().OPENID
			}
		});
	}else{
		
		return db.collection('each_game_tb').where({level: ""+event.level,name: event.name})
			.update({
			data: { 
			  time: event.time
			}
		});
	}

}
