// pages/my/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderKind:[
      {
        name:'待付款',
        src: 'order-1.png',
        path:'../order/index?index=1'
      },
      {
        name: '待发货',
        src: 'order-2.png',
        path: '../order/index?index=2'
      },
      {
        name: '待收货',
        src: 'order-3.png',
        path: '../order/index?index=3'
      },
      {
        name: '待评价',
        src: 'order-4.png',
        path: '../order/index?index=4'
      },
      {
        name: '退款',
        src: 'order-5.png',
        path: '../refundOrder/index'
      }
    ],
    myList:[
      {
        title:'我的钱包',
        path:'../myWallet/index'
      },
      {
        title: '地址管理',
        path: '../addr/index'
      }, {
        title: '分销中心',
        path: '../distribution/index'
      },
      {
        title: '设置支付密码',
        path: '../setPw/index'
      },
      {
        title: '意见反馈',
        path: '../feedBack/index'
      }
    ],
    baseurl: '../../common/img/',
    userInfo: {}
  },
  onLoad:function(options){
    // 初始化
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})