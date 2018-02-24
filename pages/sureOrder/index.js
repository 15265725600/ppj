// pages/sureOrder/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrDetail:{},
    buyer_memo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.func.WeToast();
    if (options.num){  //判断是否详情立即购买
      this.setData({
        shopId: options.id,
        shopNum: options.num,
        sizeId: options.sizeId,
        size: options.size,
        shopContent:options.content,
        shopName: options.name,
        shopImgurl: options.imgurl,
        shopPrice: options.price
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddr();   //每次都要检测一遍收货地址
  },
  // 获取收货地址
  getAddr:function(){
    var that = this;
    // var addr = wx.getStorageSync('addr');
    // if (addr){   //如果已经存在地址,直接从storage里获取
    //   this.setData({
    //     addrDetail : addr
    //   })
    // }else{   //如果没有,尝试请求接口获取默认地址
      var data = {
        session_id: wx.getStorageSync('session_id')
      }
      app.func.post('address_list',data,function(res){

        if(res.success){
          for (var i = 0; i < res.infor.length;i++){
            if (res.infor[i].defaultflag == 1){
              that.setData({
                addrDetail: res.infor[i]
              })
              that.getFeight();
              break;
            }
          }
        }
      })
    // }
  },
  // 留言
  input:function(e){
    this.setData({
      buyer_memo: e.detail.value
    })
  },
  getFeight:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      blog_ids: this.data.shopId,
      spec_ids:this.data.sizeId,
      buycounts: this.data.shopNum,
      address_id:this.data.addrDetail.id
    }

    app.func.post('bill_expressfee_get',data,function(res){
      if(res.success){
        that.setData({
          feight: res.infor[0].shipping_fee
        })
        that.getPrice()
      }
    })
  },
  // 计算总价
  getPrice:function(){
    this.setData({
      sum: this.data.shopNum * this.data.shopPrice,
      feightAndSum: this.data.shopNum * this.data.shopPrice + parseFloat(this.data.feight)
    })
  },
  // 提交订单
  submit:function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keytype:2,
      keyid: this.data.shopId,
      address_id: this.data.addrDetail.id,
      specid: this.data.sizeId,
      buycount: this.data.shopNum,
      paytype:1,
      buyer_memo: this.data.buyer_memo
    }
    console.log(data)
    app.func.post('bill_save', data,function(res){
      if(res.success){
        wx.redirectTo({
          url: '../pay/index?id=' + res.infor[0].bill_ids + '&money=' + that.data.feightAndSum
        })
      }else{
        that.wetoast.toast({ title: res.msg })
      }
    })
  }
})