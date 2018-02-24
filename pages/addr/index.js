// pages/addr/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddr()  //检测地址列表
  },
  // 获取地址列表
  getAddr: function(){
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id')
    }
    app.func.post('address_list',data,function(res){

      if (res.success && res.infor){
        that.setData({
          addrList: res.infor
        })
      }
    },this,true)
  },
  // 地址编辑
  edit:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addAddr/index?id=' + id
    })
  },
  // 地址删除
  delete:function(e){
    var that = this;
    var addrList = this.data.addrList;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      id
    }
    app.func.post('address_remove',data,function(res){
      if(res.success){
        addrList.splice(index,1);
        that.setData({
          addrList
        })
      }
    })
  },
  //设置默认地址
  setAddr:function(e){
    var addrList = this.data.addrList;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      id: addrList[index].id,
      name: addrList[index].name,
      tel: addrList[index].tel,
      province_id: addrList[index].province_id,
      city_id: addrList[index].city_id,
      district_id: addrList[index].district_id,
      address: addrList[index].address,
      defaultflag:1,
      pro_index:0,
      city_index:0,
      dis_index:0
    }
    app.func.post('address_save',data,function(res){
      console.log(res)
        if(res.success){
          for (var i = 0; i < addrList.length;i++){
            addrList[i].defaultflag = 0;
          }
          addrList[index].defaultflag = 1;
          that.setData({
            addrList
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
          },500)
        }
    })
  }
})