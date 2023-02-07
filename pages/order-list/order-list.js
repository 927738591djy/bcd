// pages/order/order.js
// import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const {
	getOrderList,
	confirmReceiptGoods
} = require('../../request/api.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		active: '04', //tab栏选项卡
		editShow: false,
		pingjia_show: false,
		lookEvaluate: false, //全部列表查看评价是否显示
		toBeDispatchedCount: 0, //待派单数目
		dispatchedCount: 0, //已派单数目
		toBeEvaluatedCount: 30, //待评价数目
		orderListArguments: {
			consignorId: wx.getStorageSync('id'),
			searchType: "", //查询类型，（01我发起的，02我关联的）
			waybillStatus: "04", //订单状态 （01待派单，02已派单，03已完成，04全部）
			// waybillSn:'', //订单编号
			// invoice_name:''//货品名称
		}, //查询订单列表需要的参数
		orderList: [], //订单列表
		goodsName: '', //搜索商品名称栏的表单值
	},

	// 评价页面展开
	pingjiaShow() {
		this.setData({
			pingjia_show: true
		})
	},

	// 取消弹出层显示
	onClose() {
		this.setData({
			pingjia_show: false
		})
	},

	// 跳转到查看踪迹页面
	track(e) {
		console.log(e);
		wx.navigateTo({
			url: '../cargo/cargo?id=' + e.currentTarget.dataset.set + '&status=' + e.currentTarget.dataset.status,
		})
	},


	//跳转到发起订单
	tosent(e) {
		wx.navigateTo({
			url: '../sent/sent?id=' + e.currentTarget.dataset.set,
		})
	},

	// tab栏切换
	onChange(e) {
		console.log(e);
		this.setData({
			active: e.detail.index,
			['orderListArguments.waybillStatus']: e.detail.name
		})

		console.log(this.data.orderListArguments);
		// // 查询订单列表
		// getOrderList(this.data.orderListArguments).then(res => {
		// 	this.setData({
		// 		orderList: res.data ? res.data.reverse() : []
		// 	})
		// }).catch(err => {
		// 	console.log(err);
		// })

		this.getOrderList()
	},

	// 查询订单列表方法
	getOrderList() {
		// 查询订单列表
		getOrderList({
			...this.data.orderListArguments,
			goodsName: this.data.goodsName? this.data.goodsName: ''
		}).then(res => {
			this.setData({
				orderList: res.data ? res.data.reverse() : []
			})
		}).catch(err => {
			console.log(err);
		})
	},

	// 确认收货
	confirmShou(e) {
		confirmReceiptGoods(e.currentTarget.dataset.set).then(res => {
			console.log(res);
			wx.showToast({
				title: '确认收货成功',
				icon: 'none',
				duration: 200
			})
			this.setData({
				active: '03'
			})
		}).catch(err => {
			console.log(err);
		})
	},

	// 输入事件
	inputHandler(e) {
		this.setData({
			goodsName: e.detail
		})
		this.getOrderList()
	},

	onCancel(e) {
		this.setData({
			goodsName:''
		})
		this.getOrderList()
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(this.data.orderListArguments.waybillStatus);
		this.setData({
			['orderListArguments.searchType']: options.search_type
		})
		console.log(this.data.orderListArguments);
		// 查询订单列表
		getOrderList(this.data.orderListArguments).then(res => {
			this.setData({
				orderList: res.data ? res.data.reverse() : []
			})
		}).catch(err => {
			console.log(err);
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