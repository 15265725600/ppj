// pages/pay/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    payPsList:[],
    payWay:[],
    payIndex:0,
    isFocus: true,//控制input 聚焦
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.id,
      money: options.money
    })
    new app.func.WeToast()
    this.getMoneyData();
    this.init()  //初始化
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 初始化
  init:function(){
    var payWay = this.data.payWay
    for (var i = 0; i < 2;i++){
      payWay[i] = false
    }
    payWay[this.data.payIndex] = true;
    this.setData({
      payWay
    })
  },
  // 选择支付方式
  chooseWay:function(e){
    var index = e.currentTarget.dataset.index;
    var payWay = this.data.payWay;
    for (var i = 0; i < payWay.length;i++){
      payWay[i] = false
    }
    payWay[index] = true
    this.setData({
      payWay,
      payIndex: index
    })
  },
  // 获取余额
  getMoneyData:function(){
    var that = this;
    var data = {
      session_id : wx.getStorageSync('session_id')
    }
    app.func.post('account_get',data,function(res){
      console.log(res)
      if(res.success){
        that.setData({
          myMoney: res.infor[0].feeaccount
        })
      }
    })
  },
  // 提交
  submit:function(){
    var that = this;
    if (this.data.payIndex == 0) {
      this.setData({
        showMark: true
      })
    }else{
      var data = {
        session_id: wx.getStorageSync('session_id'),
        order_id: this.data.orderId
      }
      app.func.post('weixinPay',data,function(res){
        var timeStamp = app.func.createTimeStamp();
        var nonceStr = app.func.getRandomStringByLength(32);
        var _package = 'prepay_id=' + res.prepay_id;
        var signType = 'MD5'
        
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: _package,
          signType: signType,
          paySign: app.func.setSignAgain(app.globalData.appid, nonceStr, _package, signType, timeStamp),
          success: function(res) {

            if (res.errMsg == 'requestPayment:ok'){
              app.func.showToast('支付成功');
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },1000)
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      })
    }
  },
  cancle:function(){
    this.setData({
      showMark: false
    })
  },
  pay:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keytype:1,
      keyid: this.data.orderId,
      total_fee:this.data.money,
      paypassword: this.data.wallets_password
    }
    app.func.post('feeaccount_remove',data,function(res){

      if(res.success){
        that.setData({
          showMark: false
        })
        app.func.showToast('订单支付成功!');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      } else if (!res.success && res.error_code == 403){
        app.func.showModal('', '您还未设置钱包支付密码 请前往个人中心设置', '取消','去设置',function(){
          wx.navigateTo({
            url: '../setPw/index'
          })
        })
      }else{
        that.setData({
          showMark: false,
          wallets_password:''
        })
        that.wetoast.toast({
          title: res.msg
        })
      }
    })
  },

  set_wallets_password(e) {//获取钱包密码
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      this.pay(this)
    }
  },
  set_Focus() {//聚焦input
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  }
})