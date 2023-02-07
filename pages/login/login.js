// pages/login/login.js
//1.引入方法
const {
  login
} = require('../../request/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: {},
		isShow: true,
		avatar:'',
		nickName:''
  },

  login() {
    wx.switchTab({
      url: '../index/index',
    })
  },

  getUserInfo(e) {
    wx.login({
      success:  (res)=> {
        if (res.code) {
          let code = res.code // 登录凭证code
          login({
            wxCode: code
          }).then(res => {
            if (res.code == 200) {
              wx.setStorageSync('token', res.data.token)
							wx.setStorageSync('id', res.data.bcdConsignor.id)
							this.setData({
								avatar:res.data.bcdConsignor.avatar,
                nickName:res.data.bcdConsignor.nickName,
                token:res.data.token
							})
							console.log(this.data.avatar);
							console.log(this.data.nickName)
							console.log(222,this.data.avatar);
							wx.switchTab({
								url: '../index/index'
							})
            }
          }).catch(err => {
            console.log(err);
          })
        }

      }
		})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})