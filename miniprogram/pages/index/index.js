//index.js
const app = getApp()

Page({
  data: {
    boxList: [
      { id: 1, flag: "1", name: "12", selected: false, animation: {} }, { id: 2, flag: "1", name: "12", selected: false, animation: {} },
      { id: 3, flag: "2", name: "23", selected: false, animation: {} }, { id: 4, flag: "2", name: "23", selected: false, animation: {} },
      { id: 5, flag: "1", name: "12", selected: false, animation: {} }, { id: 6, flag: "1", name: "12", selected: false, animation: {} },
      { id: 7, flag: "2", name: "23", selected: false, animation: {} }, { id: 8, flag: "2", name: "23", selected: false, animation: {} },
    ],
    boxLength:4,
  
  },
  //单个的点击事件
  boxItemEvn(e) {
    let curIndex = e.currentTarget.dataset.index;//当前 index
    let curItem = this.data.boxList[curIndex];
    if (!curItem || this.openNowItemArr.indexOf(curIndex)>-1) return; //没有、已经打开的、正在关闭的 则返回
    this.openItemArr.push(curIndex);//放入打开的队列里
    this.openNowItemArr.push(curIndex);//放入打开的队列里

    this.animation.rotateY(180).step();//动画翻转180度
    curItem.animation = this.animation.export();
    curItem.selected = true;//设置选中字段
    curItem.active = true;//用于标识有没有点过的
    let curStr = `boxList[${curIndex}]`;

    //设置当前的值
    this.setData({
      [curStr]: curItem
    }, () => {
      //若队列里长度大于等于 2 了 则可以进行动画效果
      if (this.openItemArr.length >= 2) {
        //当前打开的 flag与 上次打开的一致
        if (this.data.boxList[this.openItemArr[0]].flag == this.data.boxList[this.openItemArr[1]].flag) {
            this.openItemArr.shift();
            this.openItemArr.shift();
            this.openNowItemArr.shift();
            this.openNowItemArr.shift();
        }else{
          this.openItemArr.shift();
          this.openItemArr.shift();
          setTimeout(() => {
            // console.log("sss2", startIndex, i)
            //不一致 则重置
            this.setSelected(this.openNowItemArr[0], false, false);
            this.setSelected(this.openNowItemArr[1], false, false);
            this.openNowItemArr.shift();
            this.openNowItemArr.shift();
          }, 800);
        }
      }
    });
  },
  //设置selected的值以及动画
  setSelected(index, flag, isActive){
    let item = this.data.boxList[index];
    if (!item) return;
    this.animation.rotateY(flag?180:360).step();
    //selected 设置成 以及动画
    item.animation = this.animation.export();
    item.selected = flag;
    let itemStr = `boxList[${index}]`;
    this.setData({ [itemStr]: item });
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
    });
    this.openItemArr = [];
    this.openNowItemArr = [];
    this.startIndex=0;
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
