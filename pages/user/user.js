// pages/user/user.js
const {
	updateUserInfo
} = require('../../request/api.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		name_show: false,
		phone_show: false,
		password_show: false,
		avatar: '',
		nickName: '',
		filePath: ''
	},

	show() {
		this.setData({
			show: true,
		})
	},

	onClose() {
		this.setData({
			show: false,
			name_show: false,
			phone_show: false,
			password_show: false
		})
		this.setData({
			fileList: []
		})
	},

	closePopup(){
		this.setData({
			show:false
		})
	},

	nameShow() {
		this.setData({
			name_show: true,
		})
	},

	phoneShow() {
		this.setData({
			phone_show: true,
		})
	},

	passwordShow() {
		this.setData({
			password_show: true,
		})
	},

	afterRead(event) {
		console.log(this.data.filePath);
		console.log(event);
		const {
			file
		} = event.detail;
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		wx.uploadFile({
			url: 'http://192.168.2.25:8081/wx/common/storage',
			filePath: file.url,
			name: 'multipartFile',
			formData: {
				multipartFile: file.url,
				businessType: '11'
			},
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			success: (res) => {
				console.log(res);
				// 上传完成需要更新 fileList
				const {
					fileList = []
				} = this.data;
				fileList.push({
					...file,
					url: res.data
				});
				console.log(res.data);
				this.setData({
					fileList,
					filePath: JSON.parse(res.data).url
				});
			},
		});

	},

	delete(e) {
		console.log(e);
		this.setData({
			fileList: []
		})
	},

	updateUserInfo() {
		if (this.data.filePath || this.data.nickName) {
			updateUserInfo({
				avatar: this.data.filePath,
				nickName: this.data.nickName
			}).then(res => {
				if (res.code == 200) {
					wx.showToast({
						title: '修改成功',
						icon: "none",
						duration: 2000
					})
					wx.switchTab({
						url: '../my/my',
					})
				}
			}).catch(err => {
				console.log(err);
			})
		} else {
			wx.showToast({
				title: '无修改的信息',
				icon: 'none',
				duration: 2000
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options);
		this.setData({
			nickName: options.nickName
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
	onShow() {},

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