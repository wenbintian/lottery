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
    boxWLength: 4,//宽要几格
    boxHLength: 4,//高要几格
    boxType: 8,//要匹配的种类
    boxHeight:200,
    boxTypeList: ["香蕉", "苹果", "橘子", "香橙", "火龙果", "蜜柚", "百香果", "西瓜", "冬瓜", "雪梨", "哈密瓜"]
  
  },
  //单个的点击事件
  boxItemEvn(e) {
    let curIndex = e.currentTarget.dataset.index;//当前 index
    let curItem = this.data.boxList[curIndex];
    
    if (!curItem || this.openNowItemArr.indexOf(curIndex) > -1 || curItem.selected) return; //没有、已经打开的、正在关闭的 则返回

    this.openItemArr.push(curIndex);//放入打开的队列里
    this.openNowItemArr.push(curIndex);//放入打开的队列里
    console.log("wwwww", this.openNowItemArr)

    this.animation.rotateY(180).step();//动画翻转180度
    curItem.animation = this.animation.export();
    curItem.selected = true;//设置选中字段
    curItem.active = true;//用于标识有没有点过的
    let curStr = `boxList[${curIndex}]`;
    // console.log("data",this.data.boxList)
    //设置当前的值
    this.setData({
      [curStr]: curItem
    }, () => {
      //若队列里长度大于等于 2 了 则可以进行动画效果
      if (this.openItemArr.length >= 2) {
        console.log("d", this.openItemArr.length, this.openNowItemArr.length)
        //当前打开的 flag与 上次打开的一致
        if (this.data.boxList[this.openItemArr[0]].flag == this.data.boxList[this.openItemArr[1]].flag) {
          //将要移除的数据移除掉 
          let c = this.openNowItemArr.indexOf(this.openItemArr[0]);
          this.openNowItemArr.splice(c, 2);


          this.openItemArr.splice(0, 2);
      
        }else{
          // this.openItemArr.shift();
          // this.openItemArr.shift();
          this.openItemArr.splice(0, 2);
          setTimeout(() => {
            console.log("sss2", curIndex, this.openItemArr.length, this.openNowItemArr.length, this.openNowItemArr)
            //不一致 则重置
            this.setSelected(this.openNowItemArr[0], false, false);
            this.setSelected(this.openNowItemArr[1], false, false);
            this.openNowItemArr.splice(0,2);
            // this.openNowItemArr.shift();
            // this.openNowItemArr.shift();
          }, 600);
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
  //根据 boxHLength/boxWLength/boxType 创建盒子
  createBox(){
    // debugger
    //较正 boxType种类
    let l = this.data.boxHLength * this.data.boxWLength;
    l = l%2 ? l-1 : l; 
    //当前设置的类型
    let boxType = (l / 2) > this.data.boxType ? this.data.boxType : (l / 2);

    //创建boxList以及 设置 flag的值
    let arr = [];
    for(let i=0; i<(l/2); i++){
      let time = new Date().getTime()+i;
      let t = { id: time, flag:(i % boxType),animation:{},selected:false};
      arr.push(t);
      arr.push(Object.assign({}, t, { id: "temp" + time}));
    }
    for(let i=0,l=arr.length; i<l; i++){
      this.animation.rotateY(0).step();//重置动画翻转的角度 为0，解决 重新创建 不会出现动画的问题
      arr[i].animation = this.animation.export();
    }
    this.setData({ boxList: arr, boxType: boxType });
  },
  //等级设置
  btnClickEvn(e){
    let type=e.currentTarget.dataset.type;
    // debugger
    switch (type) {
      case "1":
        this.data.boxWLength = 2;
        this.data.boxHLength = 3;
        this.setData({ boxHLength: this.data.boxHLength, boxWLength: this.data.boxWLength });
        this.createBox();
        break;
      case "2":
        this.data.boxWLength = 3;
        this.data.boxHLength = 4;
        this.data.boxType = 4;
        this.setData({ boxHLength: this.data.boxHLength, boxWLength: this.data.boxWLength, boxType: this.data.boxType });
        this.createBox();
        break;
      case "3":
        this.data.boxWLength = 4;
        this.data.boxHLength = 4;
        this.data.boxType = 6;
        this.setData({ boxHLength: this.data.boxHLength, boxWLength: this.data.boxWLength, boxType: this.data.boxType });
        this.createBox();
        break;
      case "4":
        this.data.boxWLength = 4;
        this.data.boxHLength = 5;
        this.data.boxType = 8;
        this.setData({ boxHLength: this.data.boxHLength, boxWLength: this.data.boxWLength, boxType: this.data.boxType });
        this.createBox();
        break;
    }
    this.openItemArr=[];
    this.openNowItemArr = [];
  },

  onShow: function(){
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
    this.openItemArr = [];
    this.openNowItemArr = [];
    this.startIndex=0;

    this.createBox();
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

    let _sel = this;
    wx.getSystemInfo({
      success:function(res){
        console.log(res)
        //设置盒子高度
        _sel.setData({ boxHeight: res.windowHeight-150});
      }
    });

    //设置初始值

    this.boxTypeList = ["香蕉","苹果","橘子","香橙","火龙果","蜜柚","百香果","西瓜","冬瓜","雪梨","哈密瓜"];


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
