// pages/withdrawBank/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.func.WeToast()
    this.getAccount();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBankName()
  },
  getBankName:function(){
    var bankname = wx.getStorageSync('bankname');
    console.log(bankname)
    var account = this.data.account;
    if (bankname.id){
      account.bankname = bankname.name;
      this.setData({
        account,
        bankId: bankname.id
      })
      console.log(this.data.account)
    }
    
  },
  // 获取账户信息
  getAccount:function(){
    var that = this
    var data = {
      session_id: wx.getStorageSync('session_id')
    }
    app.func.post('account_get',data,function(res){
      console.log(res)
      if(res.success){
        that.setData({
          account: res.infor[0]
        })
      }
    })
  },
  inputName:function(e){
    var account = this.data.account
    account.bankuser = e.detail.value
    this.setData({
      account
    })

  },
  inputBank: function (e) {
    var account = this.data.account
    account.bankaddress = e.detail.value
    this.setData({
      account
    })
  }, 
  inputNum: function (e) {
    var account = this.data.account
    account.bankcard = e.detail.value
    this.setData({
      account
    })
  },
  inputMoney:function(e){
    this.setData({
      money:e.detail.value
    })
  },
  inputPassword:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 提交
  submit:function(){
    var that = this;
    var account = this.data.account;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      bankuser: account.bankuser,
      bankname: account.bankname,
      bankcard: account.bankcard,
      bankaddress: account.bankaddress
    }
    if (!account.bankuser || !account.bankname || !account.bankcard || !account.bankaddress){
      that.wetoast.toast({
        title: '请将银行信息填写完整！'
      })
      return false;
    }
    app.func.post('bank_save',data,function(res){
      console.log(res)
      if(res.success){
        var subdata = {
          session_id: wx.getStorageSync('session_id'),
          keytype: 1,
          applyfee: that.data.money,
          password: that.data.password
        }
        app.func.post('cash_add', subdata, function (res) {
          console.log(res)
          if (res.success) {
            wx.navigateBack({
              delta: 1,
            })
          }else{
            that.wetoast.toast({
              title: res.msg
            })
          }
        })
      }
    })

    
  }
})