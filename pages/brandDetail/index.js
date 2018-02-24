// pages/brandDetail/index.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
function getWebView(that,id) {
  app.func.post('webview/parm/companyDetail_' + id, {}, function (res) {
    if (res.length) {
      var str = res.substring(res.indexOf('<body>') + 6, res.indexOf('</body>'))
      console.log(str)
      WxParse.wxParse('article', 'md', str, that, 0);
    }

  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: options.title
    })
    getWebView(this,options.id)
  },
  
  
})