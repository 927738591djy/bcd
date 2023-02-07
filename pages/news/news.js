// pages/news/news.js
import Dialog from '@vant/weapp/dialog/dialog'

const {
	getMessageList,
	getNoticeList,
	removeMessage,
	removeNotice
} = require('../../request/api.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		type: '', //类型'01'是公告,'02'是消息
		newsList: [], //公告或者消息列表
		removeShow: false, //确认删除消息或者公告弹出层
		removeId:'', //当前要删除的消息或者公告的id
		removeType:'', //当前要删除的东西的类型
		messageNullShow:false //暂无消息或者公告是否显示
	},


	toNewsDetail(e) {
		console.log(e);
		wx.navigateTo({
			url: '../newsDetail/newDetail?id=' + e.currentTarget.dataset.set + '&type=' + e.currentTarget.dataset.type,
		})
	},

	remove() {
		if(this.data.removeType == '01'){
			// 调用删除公告接口
			removeNotice(this.data.removeId).then(res => {
				console.log(res);
				wx.showToast({
					title: '删除公告成功',
					icon: 'none',
					duration: 2000
				})
				this.getList()
			}).catch(err =>  {
				console.log(err);
			})
		}else{
			// 调用删除消息接口
			removeMessage(this.data.removeId).then(res => {
				console.log(res);
				wx.showToast({
					title: '删除消息成功',
					icon: 'none',
					duration: 2000
				})
				this.getList()
			}).catch(err =>  {
				console.log(err);
			})
		}
	},

	removeNews(e) {
		console.log(e);
		this.setData({
			removeShow: true,
			removeId:e.currentTarget.dataset.set,
			removeType:e.currentTarget.dataset.type,
		})

	},

	// 获取消息或者公告列表方法
	getList(){
		if (this.data.type == '01') {
			// 调用获取公告列表接口
			getNoticeList().then(res => {
				this.setData({
					newsList: res.data
				})
				if(this.data.newsList.length <= 0){
					this.setData({
						messageNullShow:true
					})
				}
			}).catch(err => {
				console.log(err);
			})
		} else {
			// 调用获取消息列表接口
			getMessageList({
				notifierType: '01'
			}).then(res => {
				this.setData({
					newsList: res.data
				})
				if(this.data.newsList.length <= 0){
					this.setData({
						messageNullShow:true
					})
				}

				console.log(this.data.newsList);
			}).catch(err => {
				console.log(err);
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			type: options.type
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
		this.getList()
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