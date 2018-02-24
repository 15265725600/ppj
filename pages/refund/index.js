// pages/refund/index.js
var app = getApp();
// 文件上传
function upFile(that, id,path, orderby) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    keytype: 12,
    keyid: id,
    duration: 0,
    content:'无',
    orderby: orderby
  }

  app.func.upFile('file_upload', path, 'temp_file', data, function (res) {
    var data = JSON.parse(res);

    if (data.success) {

    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseurl: '../../common/img/',
    imgList: [],
    imgIndex: 0,
    hidding:true,
    txt:'',
    count: 4   //一次选择的图片数量
  },
  onLoad:function(options){
    this.setData({
      id: options.id
    })
  },
  input: function (e) {
    this.setData({
      txt: e.detail.value
    })
  },
  // 图片上传
  selectImg: function () {
    var that = this;
    var count = this.data.count;
    var imgList = that.data.imgList;
    var imgIndex = this.data.imgIndex;
    app.func.chooseImg(count, function (res) {
      var path = res.tempFilePaths;
      if (path) {
        var num = path.length;
        imgIndex += num;
        count -= num;
        for (var i = 0; i < path.length; i++) {
          imgList.push(path[i]);
        }

        that.setData({
          imgList,
          imgIndex,
          count
        })

      }
    })
  },
  // 删除图片
  deleteImg: function (event) {
    var imgList = this.data.imgList;
    var count = this.data.count;
    var imgIndex = this.data.imgIndex;
    var index = event.currentTarget.dataset.index;
    imgList.splice(index, 1)
    count++;
    imgIndex--;
    this.setData({
      imgList,
      count,
      imgIndex
    })
  },
  // 图片预览
  previewImage: function (event) {
    var imgList = this.data.imgList;
    var index = event.currentTarget.dataset.index;
    wx.previewImage({
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 提交
  submit: function () {
    var that = this;
    var imgList = this.data.imgList;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keytype: 3,
      keyid: this.data.id,
      reason: this.data.txt,
    }

    app.func.post('bill_saveoperate', data, function (res) {

      if (res.success) {
        if (imgList.length){
          for (var i = 0; i < imgList.length; i++) {
            upFile(this, that.data.id, imgList[i], i)
          }
        }
        app.func.showToast('退款申请已提交!');
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1000)
      }
    },this,true)
  }
})