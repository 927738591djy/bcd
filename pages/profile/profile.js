// pages/profile/profile.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		avatarUrl: defaultAvatarUrl,
		value: '' //昵称表单值
	},

	// 让用户选择昵称和头像
	onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		this.setData({
			avatarUrl,
		})
	},


	toPhone() {
		if (this.data.avatarUrl && this.data.value) {
			wx.switchTab({
				url: '../index/index'
			})
		} else {
			wx.showToast({
				title: '请先绑定昵称头像',
				icon: 'none',
				duration: 2000
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			avatarUrl: options.avatar,
			value: options.nickName
		})
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