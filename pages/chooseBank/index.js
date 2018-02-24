// pages/chooseBank/index.js
var app = getApp();
// 获取银行
function getBank(that,page, bankId) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    page: page
  }
  app.func.post('bank_list', data, function (res) {

    if (res.success) {
      that.setData({
        bank: res.infor || []
      })
      //如果有,代表有默认
      if (bankId) {
        that.init(bankId, res.infor);
      }
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
    getBank(this,0, options.bankId);
  },
  // 初始化
  init: function (bankId,list){
    for(var i = 0;i<list.length;i++){
      if (list[i].id == bankId){
        this.setData({
          chooseIndex:i
        })
        break;
      }
    }
  },
  // 选择
  choose:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      chooseIndex: index
    })
  },
  submit:function(){
    var chooseIndex = this.data.chooseIndex;
    var bank = {
      name: this.data.bank[chooseIndex].name,
      id: this.data.bank[chooseIndex].id
    }
    wx.setStorageSync('bankname', bank)
    wx.navigateBack({
      delta: 1,
    })
  }
})