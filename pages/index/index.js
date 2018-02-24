//index.js
//获取应用实例
var app = getApp()
// 获取轮播图
function getSlider(that){
  app.func.post('ad_list',{},function(res){
    if (res.success){
      console.log(res)
      that.setData({
        sliderList: res.infor[0].adItems || []
      })
    }
  },that,true)
}
// 获取分类
function getKind(that){
  app.func.post('blogtype_list', { parentid:0}, function (res) {

    if (res.success) {
      that.setData({
        kindList: res.infor || []
      })
    }
  }, that, true)
}
// 获取品牌
function getCompany(that){
  app.func.post('company_list',{page:0},function(res){
    if(res.success){
      that.setData({
        company: res.infor.listItems || []
      })
    }
  }, that, true)
}

// 获取品牌
function getBrand(that) {
  app.func.post('brand_list', { page: 0 }, function (res) {
    if (res.success) {
      that.setData({
        brandList: res.infor.listItems || []
      })
    }
  }, that, true)
}
//获取地址
function getAddr(that) {
  var myAmapFun = new app.func.amapFile.AMapWX({ key: 'cb5c29c955dffc1ab2ba32c49f63f31c' });
  myAmapFun.getRegeo({
    success: function (data) {
      //成功回调
      that.setData({
        city: data[0].regeocodeData.addressComponent.city
      })
    },
    fail: function (info) {
      //失败回调
      console.log(info)
    }
  })
}
// 获取商品
function getShop(that, page){
  var data = {
    topflag:1,
    page: page
  }
  app.func.post('blog_list',data,function(res){

    if (res.success) {
      app.func.paging(page, res.infor.listItems || [], that)

    }
  }, that, true)
}
Page({
  data: {
    city:'中国',
    list:[],
    page:0,
    baseurl:'../../common/img/'
  },

  onLoad: function (options) {
    var _eCode = '';
    if (options.q){
      _eCode = this.getUrl(options.q);  
    }

    this._login(_eCode);
    getKind(this);   //获取分类
    getSlider(this)   //获取轮播图
    getAddr(this);   //获取地址
    
    getShop(this, 0);  //获取商品列表
    getBrand(this);
    getCompany(this);

  },
  // 获取url里的二维码参数
  getUrl:function(url){
    var str = 'invitecode/';
    var _eCode = '';
    url = decodeURIComponent(url);
    if (url.indexOf(str)>-1){
      _eCode = url.substr(url.indexOf(str) + str.length);
    }
    return _eCode;
  },

  // 登录
  _login: function (_eCode){
      var that = this;

      app.getUserInfo(function (res) {

        var data = {
          code: res.code,
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          superiorinvitecode: _eCode || ''
        }
        app.func.post('client_login', data, function (res) {
          console.log(res)
          if (res.success) {
            app.globalData.invitecode = res.infor[0].invitecode;
            wx.setStorageSync("token", res.infor[0].token);
            wx.setStorageSync("session_id", res.infor[0].session_id);
          }
        })
      });   //获取用户信息
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getShop(this, page);
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.detail.name,
      path: `/pages/index/index`
    }
  }
})
