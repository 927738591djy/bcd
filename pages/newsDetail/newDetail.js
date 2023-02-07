// pages/newsDetail/newDetail.js
const {
	getNoticeDetail,
	getMessageDetail
} = require('../../request/api.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detail: {}, //公告或者消息详情
		type: '' //公告或者消息类型
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options);
		this.setData({
			type: options.type
		})

		if (this.data.type == '01') {
			// 01为公告类型调用查询获取公告详情接口
			getNoticeDetail(options.id).then(res => {
				this.setData({
					detail: res.data
				})
			}).catch(err => {
				console.log(err);
			})
		} else {
			getMessageDetail(options.id).then(res => {
			this.setData({
				detail:res.data
			})
			}).catch(err => {
				console.log(err);
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