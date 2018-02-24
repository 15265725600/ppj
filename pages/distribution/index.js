// pages/distribution/index.js
var app = getApp();
//获取数据
function getData(that) {
  var data = {
    session_id: wx.getStorageSync('session_id')
  }

  app.func.post('family_get', data, function (res) {
    if (res.success) {
      that.setData({
        memberList: res.infor[0].one_member || [],
        invitecode_url: 'https://' + res.infor[0].invitecode_url
      })
    }
  }, that, true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['一级','二级'],
    tabIndex:0,
    memberList:[],
    showCode:false,
    baseurl: '../../common/img/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getData(this);
  },
  tab:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
  },
  // 生成二维码
  accrue:function(){
    this.setData({
      showCode:true
    })
  }
})