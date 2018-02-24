// pages/detail/index.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
// 商品详情
function getDetail(that){
    var data = {
      id: that.data.shopId
    }
    app.func.post('blog_get',data,function(res){
      console.log(res)
      
      if(res.success){
        that.setData({
          detail:res.infor[0]
        })
        that.getPrice(); //计算不同规格下个商品价格
      }
    })
}
// 商品评价
function getAssess(that){
  var data = {
    keytype:2,
    keyid: that.data.shopId,
    page:0
  }
  app.func.post('reply_list',data,function(res){
    if(res.success){

      that.setData({
        assessList: res.infor.listItems || []
      })  
    }
  })
}
function getWebView(that){
  app.func.post('webview/parm/blogdetail_' + that.data.shopId,{},function(res){
      if(res.length){
        var str = res.substring(res.indexOf('<body>') + 6, res.indexOf('</body>'))
        console.log(str)
        WxParse.wxParse('article', 'html', str, that, 0);
      }
        
  })
}
// 商品规格过渡出现
function setAnimation(start, end, flag, that) {
  var animation = wx.createAnimation({
    duration: 400,
  })
  that.animation = animation

  animation.bottom(start).step()

  if (!flag) { //flag为false,出现
    that.setData({
      hidden: flag,
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.bottom(end).step();
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 100)
  } else {  //flag为false,隐藏
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.bottom(end).step();
      that.setData({
        hidden: flag,
        animationData: animation.export()
      })
    }.bind(that), 400)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    baseurl: '../../common/img/',
    oneSizeIndex:0,
    twoSizeIndex: 0,
    price:0,
    leftCount:0,
    imgurl:'',
    sizeId:'',
    shopId:'',
    shopNumber:1,
    animationData:{},
    hidden:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.func.WeToast();
    this.setData({
      shopId: options.id
    })
    //如果没有session_id,代表第一次登陆
    if (!wx.getStorageSync('session_id')){
      console.log('第一次登陆')
      this._login(options.userID)
    }
    getDetail(this)//获取数据
    getAssess(this) //获取商品评价

    getWebView(this)
  },
  // 登录
  _login: function (_eCode) {
    var that = this;

    app.getUserInfo(function (res) {

      var data = {
        code: res.code,
        nickname: res.userInfo.nickName,
        avatar: res.userInfo.avatarUrl,
        superiorinvitecode: _eCode || ''
      }
      app.func.post('client_login', data, function (res) {
        if (res.success) {
          app.globalData.invitecode = res.infor[0].invitecode;
          wx.setStorageSync("token", res.infor[0].token);
          wx.setStorageSync("session_id", res.infor[0].session_id);
        }
      })
    });   //获取用户信息
  },
  // 显示商品选择action
  showAction:function(){
    setAnimation('-700rpx', '0', false, this)
  },
  // 隐藏商品选择action
  closeAction: function () {
    setAnimation('-700rpx', '0', true, this)
  },
  // 选择规格
  chooseOneSize:function(e){
    var sizeIndex = e.currentTarget.dataset.index;
    this.setData({
      shopNumber: 1,
      oneSizeIndex: sizeIndex
    })
    this.getPrice();
  },
  // 选择规格
  chooseTwoSize: function (e) {
    var sizeIndex = e.currentTarget.dataset.index;
    this.setData({
      shopNumber:1,
      twoSizeIndex:sizeIndex
    })
    this.getPrice();
  },
  //获取不同规格的价格货存跟图片
  getPrice:function(){
    var oneSizeIndex = this.data.oneSizeIndex;
    var twoSizeIndex = this.data.twoSizeIndex;
    var detail = this.data.detail;
    for (var i = 0; i < detail.specItems.length;i++){
      if (detail.specItems[i].spec_name == detail.one_specs[oneSizeIndex].name && detail.specItems[i].spec_name2 == detail.one_specs[oneSizeIndex].spec2Items[twoSizeIndex].name){
        console.log(detail.specItems[i].id)
        this.setData({
          price: detail.specItems[i].price,
          leftCount: detail.specItems[i].leftcount,
          imgurl: detail.specItems[i].imgurl,
          sizeId: detail.specItems[i].id
        })
        break;
      }
    }
  },
  // 数量增加
  add:function(){
    this.data.leftCount <= this.data.shopNumber ? this.wetoast.toast({title: '亲,没有更多存货哦!'}):this.setData({shopNumber: ++this.data.shopNumber})
  },
  // 数量减少
  del:function(){
    var shopNumber = this.data.shopNumber;
    shopNumber > 1 ? this.setData({ shopNumber: --shopNumber }) : this.setData({ shopNumber: shopNumber })
  },
  // 浏览图片
  lookImg:function(e){
    wx.previewImage({
      current: this.data.assessList[0].imgItems[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.assessList[0].imgItems // 需要预览的图片http链接列表
    })
  },
  // 立即购买
  submit:function(){
    if(this.data.hidden){ //action关闭中,需要显示
      this.showAction();
    }else{
        var data = {
          id: this.data.shopId,
          num: this.data.shopNumber,
          size: this.data.sizeIndex
        }
        var size = this.data.detail.one_specs[this.data.oneSizeIndex].name + ' ' + this.data.detail.two_specs[this.data.twoSizeIndex].name;
        wx.redirectTo({
          url: '../sureOrder/index?imgurl=' + this.data.imgurl + '&id=' + this.data.detail.id + '&name=' + this.data.detail.name + '&content=' + this.data.detail.content + '&sizeId=' + this.data.sizeId + '&num=' + this.data.shopNumber + '&price=' + this.data.price + '&size=' + size + '&feight=' + this.data.detail.expressfee
        })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  onShareAppMessage:function(){
    return{
      title: this.data.detail.name,
      path: `/pages/detail/index?id=${this.data.shopId}&userID=${app.globalData.invitecode}`
    }
  }
})