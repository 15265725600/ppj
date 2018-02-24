// pages/search/index.js
var app = getApp();
// 热门
function getHot(that){
  app.func.post('hotwords_list',{},function(res){
    if(res.success){
      that.setData({
        hotList: res.infor
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchTxt:'',
    hotList:[],
    searchFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.func.WeToast();
    getHot(this)
  },
  onShow:function(){
    var history = wx.getStorageSync('historySearch');
    this.setData({
      searchList: history
    })
  },
  input:function(e){
    var searchFlag = this.data.searchFlag;
    if (!e.detail.value){  //如果没有搜索关键字,让搜索结果列表消失
      searchFlag = true
    }
    this.setData({
      searchTxt:e.detail.value,
      searchFlag
    })
  },
  // 搜索
  search:function(){
    var searchTxt = this.data.searchTxt

    if (!searchTxt){
      this.wetoast.toast({
        title: '请填写搜索内容!'
      })
      return;
    }
    app.func.setHistory(this.data.searchTxt);
    wx.redirectTo({
      url: '../kind/index?search=' + searchTxt
    })
  }
})