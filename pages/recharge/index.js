// pages/recharge/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled:true
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  isDisabled:function(){
    var isDisabled = false;
    if (!this.data.money){
      isDisabled = true
    }
    this.setData({
      isDisabled
    })
  },
  input:function(e){
    this.setData({
      money:e.detail.value
    })
    this.isDisabled();
  },
  // 充值
  recharge:function(){
    var data = {
      session_id: wx.getStorageSync('session_id'), 
      money: this.data.money
    }
    console.log(this.data.money)
    app.func.post('walletPay',data,function(res){

      if(res.return_msg == 'OK'){
        
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
          success: function (res) {

            if (res.errMsg == 'requestPayment:ok') {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 100)
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  }
})