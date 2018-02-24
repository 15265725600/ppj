var app = getApp();
Page({
  data: {
    payment_mode: 1,//默认支付方式 微信支付
    isFocus: true,//控制input 聚焦
  },
  //事件处理函数

  onLoad: function () {

  },

  set_wallets_password(e) {//获取钱包密码
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      wallet_pay(this)
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
/*-----------------------------------------------*/

// 钱包支付
function wallet_pay(that) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    keytype: 2,
    new_password: that.data.wallets_password
  }
  app.func.post('password_save', data, function (res) {
    console.log(res)
    if (res.success) {
      wx.navigateBack({
        delta: 1,
      })
    }else{
      that.setData({
        isFocus:true,
        wallets_password:''
      })
    }
  })
  /*
  1.支付成功
  2.支付失败：提示；清空密码；自动聚焦isFocus:true，拉起键盘再次输入
  */
}