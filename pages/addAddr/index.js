// pages/addAddr/index.js
var app = getApp();
function getaAddr(that,id){
  app.func.post('district_all_get',{},function(res){
    var data = res.infor[0].children;
    if (res.success){

      if(id){
        that.getEditAddr()
      }

      that.setData({
        proList: data
      })
    }  
  },that,true)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: [],
    citList: [],
    couList: [],
    proIndex: -1,     //由于索引0代表北京，所以不能为0
    citIndex: -1,
    couIndex: -1,
    addrId: 0,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {   //有id,是地址编辑
      this.setData({
        addrId: options.id
      })
      getaAddr(this, options.id);
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '添加收货地址'
      })
      getaAddr(this);
    }
    new app.func.WeToast()
  
  },
  selce:function(e){
    console.log(e)
  },
  // 添加地址
  submit:function (e) {
    var that = this;
    var value = e.detail.value;
    for(var i = 0;i<value.length;i++){  //提交之前验证信息是否填写完整
      if (value[i] == ''){
        that.wetoast.toast({
          title: '收件人地址请填写完整!'
        })

        return;
      }
    }
    if (this.data.proIndex < 0 || this.data.citIndex < 0 || this.data.couIndex < 0){

      that.wetoast.toast({
        title: '收件人地址请填写完整!'
      })
      return;
    }
    var data = {
      session_id: wx.getStorageSync('session_id'),
      id: this.data.addrId,   // id=0,当新增地址时；id>0,当修改地址时
      name:value.name,
      tel:value.phone,
      province_id: this.data.proList[this.data.proIndex].id,
      city_id: this.data.citList[this.data.citIndex].id,
      district_id: this.data.couList[this.data.couIndex].id,
      address:value.addr,
      defaultflag:1,
      pro_index:0,
      city_index:0,
      dis_index:0
    }
    console.log(data)
    app.func.post('address_save',data,function(res){
      console.log(res)
      if(res.success){
        wx.navigateBack({
          delta: 1,
        })
      }
    },this,true)
  },
  // 获取地址详情
  getEditAddr:function(id){
    var that = this;
    var id = this.data.addrId;
    var proIndex,
        citIndex,
        couIndex;
    var proList = this.data.proList;
    var citList = this.data.citList;
    var couList = this.data.couList;
    
    var data = {
      session_id: wx.getStorageSync('session_id')
    }
    app.func.post('address_list', data,function(res){

      if(res.success){
        for (var i = 0; i < res.infor.length;i++){
          if (res.infor[i].id == id){
            
            // for (var j = 0; j < that.data.proList.length;j++){
             
            //   if (that.data.proList[j].id = res.infor[i].id){

            //     that.setData({
            //       proIndex:j,
            //       citList: proList[j],
            //     })
            //     break;
            //   }
            // }
            // for (var k = 0; k < that.data.citList.length; k++) {
            //   console.log(that.data.proList[k].parentid)
            //   if (that.data.proList[k].parentid = res.infor[i].city_id) {

            //     that.setData({
            //       citIndex: k,
            //       // couList: proList[proIndex].children[k].children
            //     })
            //     break;
            //   }
            // }
            // for (var m = 0; m < that.data.couList.length; m++) {
            //   if (that.data.proList[m].parentid = res.infor[i].district_id) {

            //     that.setData({
            //       couIndex: m
            //     })
            //     break;
            //   }
            // }

            that.setData({
              name: res.infor[i].name,
              phone: res.infor[i].tel,
              addr: res.infor[i].address
            })
            break;
          }
        }
      }
    },this,true)
  },
  // 城市选择
  proSelect: function (event) {
    var proList = this.data.proList;
    var index = event.detail.value;
    this.setData({
      citList: proList[index].children,
      proIndex: index,
      citIndex: -1,
      couIndex: -1
    })
    console.log(proList)
  },
  citSelect: function (event) {
    var proList = this.data.proList;
    var proIndex = this.data.proIndex;
    var index = event.detail.value;
    this.setData({
      citIndex: index,
      couIndex: -1,
      couList: proList[proIndex].children[index].children
    })
    console.log(this.data.couList)
  },
  couSelect: function (event) {
    var proList = this.data.proList;
    var index = event.detail.value;
    this.setData({
      couIndex: index
    })
  }
})