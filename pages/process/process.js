// pages/process/process.js
const {
	addCompany,
	searchCompanyDetail,
	updateCompany,
	getAssociatedUserList,
	removeCompanyUser
} = require('../../request/api.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		memberPhone: '', //添加成员手机号
		companyPhone: '', //认证人手机号
		companyName: '', //公司名称
		consignorCompanyId: '', //发货人公司id
		auditStatus: '', //审核状态
		status: '',
		inviteCode: '', //企业邀请码
		relationUser: [], //企业关联用户数组
		statusText: '', //底部按钮文字显示
		id: '', //当前关联成员的id
		dialogShow: false //删除对话框弹出
	},

	// 编辑企业信息按钮
	toshenhe() {
		if (this.data.consignorCompanyId !== 'null' && this.data.consignorCompanyId !== undefined) {
			updateCompany({
				companyName: this.data.companyName,
				consignorCompanyId: this.data.consignorCompanyId,
				companyPhone: this.data.companyPhone
			}).then(res => {
				wx.showToast({
					title: '修改成功',
					icon: 'none'
				})
				this.searchCompanyDetail()

			}).catch(err => {
				console.log(err);
			})
		} else {
			addCompany(this.data).then(res => {
				console.log(res);
				wx.showToast({
					title: '提交成功',
				})
				console.log(this.data.consignorCompanyId);
				// this.searchCompanyDetail()
				wx.switchTab({
					url: '../index/index',
				})
			}).catch(err => {
				console.log(err);
			})
		}
	},


	// 查询企业关联用户
	getAssociatedUserList() {
		console.log(333);
		getAssociatedUserList({
			consignorCompanyId: this.data.consignorCompanyId
		}).then(res => {
			this.setData({
				relationUser: res.data,
			})
			console.log(this.data.relationUser);
		}).catch(err => {
			console.log(err);
		})
	},


	// 确认删除对话框弹出
	delete(e) {
		this.setData({
			dialogShow: true,
			id: e.currentTarget.dataset.set
		})
	},

	// 删除企业关联用户
	confirmDelete() {
		removeCompanyUser({
			delConsignorId: this.data.id
		}).then(res => {
			if (res.code == 200) {
				wx.showToast({
					title: '删除成功',
					duration: 2000,
					icon: "none"
				})
			}
			this.getAssociatedUserList()
		}).catch(err => {
			console.log(err);
		})
	},


	searchCompanyDetail() {
		searchCompanyDetail(this.data.consignorCompanyId).then(res => {
			console.log(res);
			this.setData({
				companyName: res.data.companyName,
				auditStatus: res.data.auditStatus,
				inviteCode: res.data.inviteCode
			})
			if (this.data.auditStatus == '01') {
				this.setData({
					status: '待审核',
					statusText: '编辑'
				})
			} else if (this.data.auditStatus == '02') {
				this.setData({
					status: '审核通过',
					statusText: "编辑"
				})
			} else if (this.data.auditStatus == '03') {
				this.setData({
					status: '审核驳回',
					statusText: '编辑'
				})
			} else {
				this.setData({
					status: '提交审核'
				})
			}
			this.getAssociatedUserList()

		}).catch(err => {
			console.log(err);
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    console.log("执行onLoad");
    console.log(options);
    console.log(wx.getStorageSync('mobile'));
		this.setData({
			consignorCompanyId: options.consignorCompanyId,
      companyPhone:wx.getStorageSync('mobile')
    })
    console.log(this.data.companyPhone);
		if (this.data.consignorCompanyId !== 'null' && this.data.consignorCompanyId !== undefined && this.data.consignorCompanyId !== '') {
			this.searchCompanyDetail()
		} else {
			this.setData({
				status: '待提交审核',
				statusText: '提交'
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