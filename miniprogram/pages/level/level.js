// pages/honor/honor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySelfData:null,//我的排名
    selfList: [],
    level:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.level = options.level || 1;
    this.setData({level:this.data.level});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.globalData.userInfo={};
    // app.globalData.userInfo.nickName="文滨";
    let _sel = this;
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'getByNameLevel',
      data: {
        level: _sel.data.level
      },
      success: res => {
        this.data.selfList = res.result.data;
        this.setData({ selfList: this.data.selfList });
        this.setMySelfData(this.data.selfList);
        wx.hideLoading();
      },
      fail: err => {
        wx.hideLoading();
        console.log(err)
      }
    })

  },
  setMySelfData(res){
    this.data.mySelfData=null;
    let nickName = app.globalData.userInfo.nickName;
    for(let i=0,l=res.length; i<l; i++){
      if (nickName == res[i].name){
        this.data.mySelfData = res[i];
        this.data.mySelfData.uiIndex = i+1;
        break;
      }
    }
    this.setData({mySelfData: this.data.mySelfData});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})