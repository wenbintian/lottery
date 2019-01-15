//index.js
const app = getApp()

Page({
  data: {
    boxList: [
      { id: 1, flag: "1", name: "一", selected: false, animation:{} }, { id: 2, flag: "1", name: "一", selected: false, animation:{} }, 
      { id: 3, flag: "2", name: "二", selected: false, animation:{} }, { id: 4, flag: "2", name: "二", selected: false, animation:{} }
    ],
    boxLength:2,
  
  },
  //单个的点击事件
  boxItemEvn(e){
    let curIndex = e.currentTarget.dataset.index;//当前 index
    let curItem = this.data.boxList[curIndex];
    if (!curItem) return;
    curItem.selected = true;
    let curStr = `boxList[${curIndex}]`;
    let curAni = curStr+".animation"
    console.log(curStr)
    this.animation.scale(2, 2).rotate(45).step()

    //设置当前的值
    this.setData({
      [curStr]:curItem,
      [curAni]: this.animation.export()
    });
    


  },
  //通过ID 获取对应的值
  getCurrentItem(id){
    if(!id) return null;
    for(let i=0,l=this.data.boxList.length; i<l; i++){
      if(this.data.boxList[i].id==id){
        return this.data.boxList[i];
      }
    }
    return null;
  },

  onShow: function(){
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
  },




  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log("res", res.userInfo);
            }
          })
        }
      }
    })
  },

  // onGetUserInfo: function(e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },


  // // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },

})
