var js = require('/common/js/index');
var { WeToast } = require('utils/wetoast.js');
var amapFile = require('/libs/amap-wx.js');
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },
  getUserInfo:function(cb){
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        //获取登录code,然后换取openid跟session_key
        if (res.code) {
          var code = res.code

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              var _res = {
                code:code,
                userInfo: res.userInfo
              }
              return typeof cb == 'function' && cb(_res)
            }
          })
        }
      }
    })
  },

  globalData:{
    userInfo:null,
    invitecode:'',
    base_url:'',
    // code: null,
    appid: "wx25f9c69bf969087d",
    // secret: "67c9f461156345aade7d623e3de8077c"
  },
  func:{
    post:js.post,
    get: js.get,
    getOpenId: js.getOpenId,
    getData: js.getData,
    chooseImg: js.chooseImg,
    upFile: js.upFile,
    showModal: js.showModal,
    showAlert: js.showAlert,
    showToast: js.showToast,
    amapFile: amapFile,
    WeToast: WeToast,
    setHistory: js.setHistory,
    paging: js.paging,
    getRandomStringByLength: js.getRandomStringByLength,
    setSign: js.setSign,
    setSignAgain: js.setSignAgain,
    setXMLNodeValue: js.setXMLNodeValue,
    getXMLNodeValue: js.getXMLNodeValue,
    createTimeStamp: js.createTimeStamp
  }
})