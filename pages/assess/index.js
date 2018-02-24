// pages/assess/index.js
var app = getApp();
// 文件上传
function upFile(that, reply_id, path, orderby) {
  var data = {
    session_id: wx.getStorageSync('session_id'),
    keytype:11,
    keyid: reply_id,
    duration:0,
    content:'无',
    orderby: orderby
  }
  console.log(path)
  app.func.upFile('file_upload', path, 'temp_file', data, function (res) {
    var data = JSON.parse(res);
    console.log(res)
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
    imgList:[],
    imgIndex: 0,
    hidding:true,
    txt:'',
    count: 4   //一次选择的图片数量
  },
  onLoad:function(options){
    console.log(options)
    this.setData({
      id:options.id
    })
  },
  // 评分星星
  grade:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      starIndex:index
    })
  },
  input:function(e){
    this.setData({
      txt:e.detail.value
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
        for(var i = 0;i<path.length;i++){
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
  submit:function(){
    var imgList = this.data.imgList;
    var data = {
      session_id: wx.getStorageSync('session_id'),
      keytype:2,
      keyid: this.data.id,
      content:this.data.txt,
      stars: parseInt(this.data.starIndex) + 1,
      parentid:0
    }

    app.func.post('reply_add',data,function(res){
      console.log(res)
      if (res.success){
        console.log("执行")
        var reply_id = res.infor[0].reply_id;
        for (var i = 0; i < imgList.length; i++) {
          upFile(this, reply_id, imgList[i],i)
        }
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  }
})