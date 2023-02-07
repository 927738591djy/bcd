// pages/bindCompany/bindCompany.js
const {
	bindCompany
} = require('../../request/api.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		consignorId: '', //发货人id
		inviteCode: '' //公司邀请码
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options);
		this.setData({
			consignorId: options.id
		})
	},

	bindCompany() {

		if (this.data.inviteCode && this.data.consignorId) {

			bindCompany(this.data).then(res => {
				console.log(res);
				wx.showToast({
					title: '绑定企业成功',
					icon: 'none',
					duration: 2000
				})
				wx.switchTab({
					url: '../my/my',
				})

			}).catch(err => {
				console.log(err);
				wx.showToast({
					title: err,
					icon: 'none',
					duration: 2000
				})
			})
		} else {
			wx.showToast({
				title: '邀请码不能为空',
				icon: 'none',
				duration: 2000
			})
		}

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