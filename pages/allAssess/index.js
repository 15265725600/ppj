// pages/allAssess/index.js
var app = getApp();
// 商品评价
function getAssess(that,page) {
  var data = {
    keytype: 2,
    keyid: that.data.shopId,
    page: page
  }
  app.func.post('reply_list', data, function (res) {
    if (res.success) {
      var _res = res.infor.listItems || []
      app.func.paging(page, _res, that)
    }
  },that,true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:'',
    page:0,
    list:[],
    baseurl: '../../common/img/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId:options.id
    })
    getAssess(this,0);  //获取评价
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      this.getAssess(this, page);
    }
  },
  // 浏览图片
  lookImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var subindex = e.currentTarget.dataset.subindex;
    wx.previewImage({
      current: this.data.list[index].imgItems[subindex], // 当前显示图片的http链接
      urls: this.data.list[index].imgItems // 需要预览的图片http链接列表
    })
  },
})