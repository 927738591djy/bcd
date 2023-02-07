// pages/inviteCompany/inviteCompany.js
const {
	inviteCompany,
	getInviteCompanyList,
	deleteCompany
} = require('../../request/api.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		value: '', //添加的成员手机号
		companyList: [], //添加的成员列表
		dialogShow: false, //确认山粗对话框
		id: '' //当前选中要删除的成员id
	},

	// 添加成员手机号
	inviteCompany() {
		console.log(this.data.value);
		inviteCompany({
			inviteMobile: this.data.value
		}).then(res => {
			console.log(res);
			if(res.code == 200){
					// 查询成员手机号列表
					wx.showToast({
						title: '添加成功',
						duration: 2000,
						icon: "none"
					})
			this.getInviteCompanyList()
			}
		}).catch(err => {
			console.log(err);
		})
	},

	// 确认删除对话框弹出
	delete(e) {
		console.log(e);
		this.setData({
			dialogShow: true,
			id: e.currentTarget.dataset.set
		})
	},

	// 查询添加的成员手机号列表
	getInviteCompanyList(){
		getInviteCompanyList().then(res => {
			console.log(res);
			this.setData({
				companyList:res.rows
			})
		}).catch(err => {
			console.log(err);
		})
	},


	// 确认删除成员并上传id
	confirmDelete() {
		deleteCompany(this.data.id).then(res => {
			console.log(res);
			if (res.code == 200) {
				// 查询成员手机号列表
				wx.showToast({
					title: '删除成功',
					duration: 2000,
					icon: "none"
				})
			this.getInviteCompanyList()
			}
		}).catch(err => {
			console.log(err);
		})

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// 查询成员手机号列表
		this.getInviteCompanyList()
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