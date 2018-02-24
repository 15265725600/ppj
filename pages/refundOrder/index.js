// pages/refundOrder/index.js
var app = getApp();
// 获取数据
function getData(that,page) {

  var data = {
    session_id: wx.getStorageSync('session_id'),
    page: page
  }
  app.func.post('afterservice_bill_list', data, function (res) {

    if (res.success && res.infor.listItems) {

      app.func.paging(page, res.infor.listItems, that);
    }
  }, that, true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page: 0,
    baseurl: '../../common/img/',
    status: ['','审核中', '审核成功','审核失败']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getData(this,0)
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getData(this,page);
    }
  },
  // 取消申请
  // cancel:function(e){

  //   var that = this;
  //   var data = {
  //     session_id: wx.getStorageSync('session_id'),
  //     keyid: e.currentTarget.dataset.id,
  //     keytype:5
  //   }

  //   app.func.post('',data,function(res){

  //     if(res.success){
  //       that.getData(0)
  //     }
  //   })
  // }
})