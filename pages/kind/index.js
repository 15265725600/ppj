// pages/kind/index.js
var app = getApp();
// 获取数据
function getData(that, page){
  var data = {}
  if (that.data.id){
    data = {
      parent_typeid: that.data.id,
      page: page
    }
  } else if (that.data.keyword){
    data = {
      keyword: that.data.keyword,
      page: page
    }
  } else if (that.data.band){
    data = {
      brand_id: that.data.band,
      page: page
    }
  }
  app.func.post('blog_list',data,function(res){
    if(res.success){
      app.func.paging(page, res.infor.listItems || [], that)

    }
  }, that, true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id:options.id,
        band: options.band,
        keyword: options.search
      })
      wx.setNavigationBarTitle({  //设置tiobar文字
        title: options.title || options.search
      })

      getData(this,0)
  },
  // 加载更多
  getMore: function (e) {
    var page = this.data.page;
    if (this.data.list.length >= page * 20 && this.data.hidding) {
      getData(this, page);
    }
  },
})