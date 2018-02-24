// pages/myWallet/index.js
var app = getApp();
// 余额
function money(that) {
  var data = {
    session_id: wx.getStorageSync('session_id')
  }
  app.func.post('account_get', data, function (res) {

    if (res.success) {
      that.setData({
        money: res.infor[0].feeaccount
      })
    }
  }, that, true)
}
// 使用明细
function moneyUseInfo(that,page) {
  var moneyUseList = that.data.moneyUseList;

  var data = {
    session_id: wx.getStorageSync('session_id'),
    page: page
  }

  app.func.post('feeaccount_trade_list', data, function (res) {

    if (res.success && res.infor.listItems) {
      app.func.paging(page, res.infor.listItems, that)
    }
  }, that, true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    moneyUseList:[],
    list:[],
    page:0
  },
  onShow:function(){
    money(this);

    moneyUseInfo(this,0)
  },
  // 加载更多
  getMore:function(e){
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding){
      moneyUseInfo(this,page);
    }
  },
  // 提现
  withdraw:function(){
    wx.showActionSheet({
      itemList: ['提现到微信'],
      itemColor: '#010101',
      success: function(res) {

        var index = res.tapIndex;
        // if(index == 0){
        //   wx.navigateTo({
        //     url: '../withdrawBank/index'
        //   })
        // } 
        if (index == 0){
          wx.navigateTo({
            url: '../withdrawWX/index'
          })
        }
      }
    })
  },
  // 充值
  recharge:function(){
    wx.navigateTo({
      url: '../recharge/index'
    })
  }
})