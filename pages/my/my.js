// pages/mine/mine.js
const {
	getUserInfo,
	bindCompany,
} = require('../../request/api.js');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {} //用户信息对象	
	},
	/**
	 * 生命周期函数--监听页面加载
	 */

	logout() {
		wx.request({
			url: 'http://192.168.2.25:8081/logout',
			header: {
				'Authorization': wx.getStorageSync('token')
			}
		})
		wx.removeStorageSync('token')
		wx.removeStorageSync('id')
		wx.removeStorageSync('mobile')
		wx.switchTab({
			url: '../index/index',
		})

	},

	getUserInfo() {
		getUserInfo().then(res => {
			if (res.code == 200) {
				this.setData({
					userInfo: res.data
				})
				console.log(this.data.userInfo);
			}
		}).catch(err => {
			console.log(err);
		})
	},

	correct(e) {
		wx.navigateTo({
			url: '../process/process?consignorCompanyId=' + e.currentTarget.dataset.set + '&companyPhone=' + this.data.userInfo.consignorMobile,
		})
	},

	toBindCompany(e) {
		console.log(e);
		wx.navigateTo({
			url: '../bindCompany/bindCompany?id=' + e.currentTarget.dataset.set,
		})
	},

	toUser(e){
		wx.navigateTo({
			url: '../user/user?nickName=' + e.currentTarget.dataset.set,
		})
	},
	
	// 点击两个小图标去消息列表页面
	toNewsList(e) {
		// 点击传参，"01"代表公告，"02"代表消息
		console.log(e);
		wx.navigateTo({
			url: '../news/news?type=' + e.currentTarget.dataset.set,
		})
	},

	toInviteCompany(e){
		wx.navigateTo({
			url: '../inviteCompany/inviteCompany'
		})
	},


	onLoad(options) {
		this.getUserInfo()
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
		this.getUserInfo()
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