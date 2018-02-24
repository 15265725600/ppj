// pages/brands/index.js
var app = getApp();
// 获取品牌
function getBrand(that,page) {
  app.func.post('brand_list', { page: page }, function (res) {
    if (res.success) {
      app.func.paging(page, res.infor.listItems || [], that)
    }
  },that,true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseurl: '../../common/img/',
    page:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getBrand(this,0);
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getBrand(this,page);
    }
  },
})