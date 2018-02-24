// pages/withdrawWX/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.func.WeToast()
    this.getAccount();
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
  inputWX: function (e) {
    var account = this.data.account
    account.WX = e.detail.value
    this.setData({
      account
    })

  },
  inputMoney: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  inputPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 获取账户信息
  getAccount: function () {
    var that = this
    var data = {
      session_id: wx.getStorageSync('session_id')
    }
    app.func.post('account_get', data, function (res) {
      console.log(res)
      if (res.success) {
        that.setData({
          account: res.infor[0]
        })
      }
    })
  },
  // 提交
  submit: function () {
    var that = this;
    var account = this.data.account;
    // var data = {
    //   session_id: wx.getStorageSync('session_id')
    //   // alipay: account.WX,

    // }
    // // console.log(data)
    // if (!account.WX) {
    //   that.wetoast.toast({
    //     title: '请填写要提现的微信账号!！'
    //   })
    //   return false;
    // }
    // app.func.post('alipay_save', data, function (res) {
    //   console.log(res)
    //   if (res.success) {
        var subdata = {
          session_id: wx.getStorageSync('session_id'),
          keytype: 2,
          applyfee: that.data.money,
          password: that.data.password
        }
        if (subdata.applyfee < 100 || !subdata.applyfee) {
          that.wetoast.toast({
            title: '提现金额最少100!'
          })
          return false;
        }
        app.func.post('cash_add', subdata, function (res) {

          if (res.success) {
            app.func.showToast('提现申请已提交!!');
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          } else {
            that.wetoast.toast({
              title: res.msg
            })
          }
        })
      // }
    // })
  }
})