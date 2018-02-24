// pages/company/index.js
var app = getApp();
// 获取企业
function getCompany (that,page) {
  app.func.post('company_list', { page: page }, function (res) {
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
    page:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getCompany(this,0);
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getCompany(this, page);
    }
  }
})