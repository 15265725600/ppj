// pages/orderDetail/index.js
var app = getApp();
//获取数据
function getData(that) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    id: that.data.id
  }
  app.func.post('bill_get', data, function (res) {

    if (res.success) {
      that.setData({
        orderDetail: res.infor[0]
      })
    }
  }, that, true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseurl: '../../common/img/',
    handleList: ['取消订单', '', '确认收货', '', '删除订单'],
    status: ['待付款', '待发货', '待收货', '待评价', '已完成']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    getData(this);
  },
  // 订单操作
  handle: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.tradetype;
    var id = e.currentTarget.dataset.id;
    var content = '';
    var keytype = 0;
    if (type == 0) {  //取消订单
      content = '确定要取消订单吗?';
      keytype = 1;
    } else if (type == 2) {   //确认收货
      content = '确定要确认收货吗?';
      keytype = 2;
    } else if (type == 4) {   //删除订单
      content = '确定要删除订单吗?';
      keytype = 4;
    }
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keyid: id,
      keytype: keytype,

    }

    app.func.showModal('提示', content, function () {
      app.func.post('bill_saveoperate', data, function (res) {

        if (res.success) {
          wx.navigateBack({
            delta: 1,
          })
        }
      },that,true)
    },'取消', '确定',)
  },
  //支付
  pay: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../pay/index?id=' + id + '&money=' + this.data.orderDetail.total_fee
    })
  }
})