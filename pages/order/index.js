// pages/order/index.js
var app = getApp();
// 获取订单列表
function getOrder(that, keytype, page){
  keytype = parseInt(keytype) + 1;
  var data = {
    session_id: wx.getStorageSync('session_id'),
    billtype:1,
    keytype: keytype,
    page: page
  }

  app.func.post('bill_list',data,function(res){

    if (res.success){
      var _res = res.infor.listItems || []; //处理后台返回的空数组数据
      console.log(_res)
      app.func.paging(page, _res, that)
 
    }
  },that,true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    orderStatus:0,
    status: ['待付款', '待发货', '待收货', '待评价','已完成'],
    tab: ['全部', '待付款', '待发货', '待收货', '待评价'],
    handleList: ['取消订单', '', '确认收货', '','删除订单'],
    baseurl: '../../common/img/',
    page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderStatus = options.index;
    if (orderStatus) { //1:全部；2:待付款；3:待发货；4:待收货；5:待评价；6:已完成

      this.setData({
        orderStatus
      })
    }
    
  },
  onShow:function(){
    getOrder(this, this.data.orderStatus, 0);//获取order
  },
  // tab切换
  tab:function(e){
    var orderStatus = e.currentTarget.dataset.index;
    this.setData({
      orderStatus
    })
    getOrder(this, orderStatus, 0);//获取order
  },
  // 订单操作
  handle:function(e){
    var that = this;
    var type = e.currentTarget.dataset.tradetype;
    var id = e.currentTarget.dataset.id;
    var content = '';
    var keytype = 0;
    if(type == 0){  //取消订单
      content = '确定要取消订单吗?';
      keytype = 1;
    } else if (type == 2){   //确认收货
      content = '确定要确认收货吗?';
      keytype = 2;
    } else if (type == 4){   //删除订单
      content = '确定要删除订单吗?';
      keytype = 4;
    }
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keyid:id,
      keytype: keytype,

    }

    app.func.showModal('提示', content, function(){
      app.func.post('bill_saveoperate',data,function(res){

        if(res.success){
          getOrder(that, that.data.orderStatus, 0)
        }
      })
    }, '取消', '确定')
  },
  // 加载更多数据
  getMore:function(){
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getOrder(this, this.data.orderStatus, page)
    }
  },
  //支付
  pay:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../pay/index?id=' + id + '&money=' + this.data.list[index].total_fee
    })
  }
})