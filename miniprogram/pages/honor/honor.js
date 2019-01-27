// pages/honor/honor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  createNoneList(res){
    let arr=[];
    for (var i = 0; i < 30; i++) {
      arr.push({time:"0",level:i+1});
    }
     for (var i = 0,l=res.length; i < l; i++) {
      arr[parseInt(res[i].level)-1].time = res[i].time;
    }
    this.data.selfList = arr;
    this.setData({selfList:this.data.selfList});
  },
  gameAgainEvn(e){
    e.stopPropagation;
    let gamenum = e.currentTarget.dataset.gamenum;
    wx.navigateTo({
      url: "../main/main?gamenum="+gamenum
    });
  },

  goLevelPage(e){
    let level = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: "../level/level?level="+level
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.globalData.userInfo={};
    // app.globalData.userInfo.nickName="文滨";
    let _sel=this;
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'getByNameLevel',
      data: {
        name: app.globalData.userInfo.nickName
      },
      success: res => {
        _sel.createNoneList(res.result.data);
        wx.hideLoading();
      },
      fail: err => {
        wx.hideLoading();
        console.log(err)
      }
    })

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