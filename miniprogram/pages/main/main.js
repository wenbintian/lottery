//main.js
const app = getApp()

Page({
  data: {
    boxList: [
      // { id: 1, flag: "1", name: "12", selected: false, animation: {} }, { id: 2, flag: "1", name: "12", selected: false, animation: {} },
      // { id: 3, flag: "2", name: "23", selected: false, animation: {} }, { id: 4, flag: "2", name: "23", selected: false, animation: {} },
      // { id: 5, flag: "1", name: "12", selected: false, animation: {} }, { id: 6, flag: "1", name: "12", selected: false, animation: {} },
      // { id: 7, flag: "2", name: "23", selected: false, animation: {} }, { id: 8, flag: "2", name: "23", selected: false, animation: {} },
    ],
    boxWLength: 4,//宽要几格
    boxHLength: 4,//高要几格
    boxType: 8,//要匹配的种类
    boxHeight: 200,
    boxTypeList: ["香蕉", "苹果", "橘子", "香橙", "火龙果", "蜜柚", "百香果", "西瓜", "冬瓜", "雪梨", "哈密瓜"],
    lastTime:2,//倒计时
    showMask:true,//显示遮罩
    nowGameTime:0,//当前关用时（单位秒）
    gameAllTime:0,//所有关卡的总用时
    theGameNum:1,//当前是第几关

  },
  //单个的点击事件
  boxItemEvn(e) {
    let curIndex = e.currentTarget.dataset.index;//当前 index
    let curItem = this.data.boxList[curIndex];

    if (!curItem || this.openNowItemArr.indexOf(curIndex) > -1 || curItem.selected) return; //没有、已经打开的、正在关闭的 则返回

    this.openItemArr.push(curIndex);//放入打开的队列里
    this.openNowItemArr.push(curIndex);//放入打开的队列里(包括 动画还没有完成的 那些关闭的选项)

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
        let boxList = this.data.boxList;

        //当前打开的 flag与 上次打开的一致
        if (boxList[this.openItemArr[0]].flag == boxList[this.openItemArr[1]].flag) {
          //将要移除的数据移除掉 
          let c = this.openNowItemArr.indexOf(this.openItemArr[0]);
          this.openNowItemArr.splice(c, 2);
          this.openItemArr.splice(0, 2);
          this.openNextGame();
        } else {
          this.openItemArr.splice(0, 2);
          setTimeout(() => {
            console.log("sss2", curIndex, this.openItemArr.length, this.openNowItemArr.length, this.openNowItemArr)
            //不一致 则重置
            this.setSelected(this.openNowItemArr[0], false, false);
            this.setSelected(this.openNowItemArr[1], false, false);
            this.openNowItemArr.splice(0, 2);
          }, 200);
        }
      }

    });
  },
  //判断是否都已经翻开了 并做下一个的逻辑
  openNextGame(){
    //判断是否已经全部打开
    let boxList = this.data.boxList;
    let isComplete = true;
    for (let i = 0, l = boxList.length; i < l; i++) {
      if (!boxList[i].selected) {
        isComplete = false;
        break;
      }
    }
    if (!isComplete) return;//还没有完成 则返回
    let _sel=this;

    if (this.nowGameTimeTimer) clearInterval(this.nowGameTimeTimer);//关闭当前关卡的计时器 并将时间进行累加
    let nowTime = this.data.nowGameTime;

    this.data.gameAllTime = parseFloat(this.data.gameAllTime) + parseFloat(nowTime);
    this.setData({ gameAllTime: this.data.gameAllTime.toFixed(2), nowGameTime:0});
    let tip = `恭喜过关，用时: ${nowTime}s`;
    wx.showModal({
      content: tip,
      showCancel: false,
      confirmText: '下一关',
      success(res) {
        if (res.confirm) {
          _sel.data.theGameNum++;
          _sel.setData({ theGameNum: _sel.data.theGameNum});
          _sel.openTheGame();
        }
      }
    })
  },
  //打开第几关游戏
  // theGameNum: 代表第几关
  openTheGame(){
    this.setLevelBox(this.data.theGameNum, true);
    this.showTheTime(3);
  },

  //设置selected的值以及动画
  setSelected(index, flag, isActive) {
    let item = this.data.boxList[index];
    if (!item) return;
    this.animation.rotateY(flag ? 180 : 360).step();
    //selected 设置成 以及动画
    item.animation = this.animation.export();
    item.selected = flag;
    let itemStr = `boxList[${index}]`;
    this.setData({ [itemStr]: item });
  },
  //通过ID 获取对应的值
  getCurrentItem(id) {
    if (!id) return null;
    for (let i = 0, l = this.data.boxList.length; i < l; i++) {
      if (this.data.boxList[i].id == id) {
        return this.data.boxList[i];
      }
    }
    return null;
  },
  //根据 boxHLength/boxWLength/boxType 创建盒子
  //isOpen. true代表 展开显示   false 代表 盖住
  createBox(isOpen=false) {
    //较正 boxType种类
    let l = this.data.boxHLength * this.data.boxWLength;
    l = l % 2 ? l - 1 : l;
    //当前设置的类型
    let boxType = (l / 2) > this.data.boxType ? this.data.boxType : (l / 2);

    //创建boxList以及 设置 flag的值
    let arr = [];
    for (let i = 0; i < (l / 2); i++) {
      let time = new Date().getTime() + i;
      let t = { id: time, flag: (i % boxType), animation: {}, selected: isOpen };
      arr.push(t);
      arr.push(Object.assign({}, t, { id: "temp" + time }));
    }

    //处理随机分配的问题
    for (let i = 0; i < arr.length; i++) {
      let random = Math.round(Math.random() * (arr.length - 1));//抽取 0 到 length-1 的随机数

      let curT = Object.assign({}, arr[i]);//当前的item
      this.animation.rotateY(0).step();//重置动画翻转的角度 为0，解决 重新创建 不会出现动画的问题
      curT.animation = this.animation.export();

      //随机的 item 与 当前的item相交换
      arr[i] = arr[random];
      arr[random] = curT;

    }


    this.setData({ boxList: arr, boxType: boxType });
  },
  //重置游戏等级
  setLevelBox(type,isOpen) {
    this.openItemArr = [];
    this.openNowItemArr = [];//放入打开的队列里(包括 动画还没有完成的 那些关闭的选项)
    let arr = this.gameLevelArr[type];
    this.data.boxWLength = arr[0];
    this.data.boxHLength = arr[1];
    this.data.boxType = arr[2];
    this.setData({ boxHLength: this.data.boxHLength, boxWLength: this.data.boxWLength, boxType: this.data.boxType });
    this.createBox(isOpen);
  },
  //显示倒计时
  showTheTime(firstTime=6){
    this.setData({ lastTime: firstTime, showMask:true});
    if (this.lastTimeTimer) clearInterval(this.lastTimeTimer);
    this.lastTimeTimer = setInterval(()=>{
      if (this.data.lastTime<2){
        clearInterval(this.lastTimeTimer);
        this.openAllBox(false);//将所有的卡片翻面
        this.setData({ showMask: false, nowGameTime: 0});//关闭遮罩 重置定时器
        this.lastTimeTimer=null;

        //创建 当前关卡的 计时时间
        if (this.nowGameTimeTimer) clearInterval(this.nowGameTimeTimer);
        this.nowGameTimeTimer = setInterval(()=>{
          this.data.nowGameTime = 0.01 + parseFloat(this.data.nowGameTime);
          this.setData({ nowGameTime: this.data.nowGameTime.toFixed(2)});
        },10);

      }else{
        this.data.lastTime--;
        this.setData({ lastTime: this.data.lastTime });
      }

    },1000);
  },
  //打开所有的牌
  openAllBox(isTrue=true){
    let boxList = this.data.boxList;
    for (let i = 0, l = boxList.length; i<l; i++){
      boxList[i].selected = isTrue;
    }
    this.setData({ boxList: boxList});
  },

  onShow: function () {
    //游戏难度设置
    this.gameLevelArr = [
      [2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 3], [2, 3, 3], [3, 3, 3], [3, 3, 4], [3, 3, 4], [3, 4, 5], [3, 4, 6], [3, 4, 6],
      [3, 5, 6], [3, 5, 7], [4, 4, 6], [4, 4, 7], [4, 4, 8], [4, 5, 7], [4, 5, 8], [4, 5, 9], [4, 5, 10], [5, 5, 8], [5, 5, 9],
      [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2],
    ];
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });
    // nowGameTime: 0,//当前关用时（单位秒）
    // gameAllTime: 0,//所有关卡的总用时
    // theGameNum: 1,//当前是第几关
    this.setData({ theGameNum: 1, gameAllTime: 0, nowGameTime: 0});

    this.openTheGame();
  
  },


  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    let _sel = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        //设置盒子高度
        _sel.setData({ boxHeight: res.windowHeight - 100 });
      }
    });

    //设置初始值

    this.boxTypeList = ["香蕉", "苹果", "橘子", "香橙", "火龙果", "蜜柚", "百香果", "西瓜", "冬瓜", "雪梨", "哈密瓜"];


  },

})
