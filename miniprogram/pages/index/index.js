//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged:false
  },

  onShow: function(){
    this.doGetUserInfo();
  },
  doGetUserInfo() {
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
              });
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  btnClickEvn(e){
    if(app.globalData.userInfo.nickName){
      wx.navigateTo({
        url: '../main/main',
      })
    }
    console.log(app.globalData.userInfo)
  },
  gameLevelEvn(){
    if (app.globalData.userInfo.nickName) {
      wx.navigateTo({
        url: '../honor/honor',
      })
    }
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo;

    }
  },


  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

  },
   onShareAppMessage: function () {

  }
})
