// pages/sent/sent.js
import {
	areaList,
} from '../../miniprogram_npm/@vant/area-data/index';
const ss = require('../../common/util.js')
const {
	addWaybill,
	getAssociatedUserList,
	getUserInfo,
	getOrderDetail,
	updateOrder,
} = require('../../request/api.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		areaList, //国家省市区表
		message: '', //地址
		mudi_show: false,
		area_show: false,
		result: [],
		orderId: '', //订单列表页传过来的订单id
		// 线路信息
		shippingAddress: '',
		deliveryAddress: '',

		startPlice:'',
		EndPlice:'',
		
		// 发货人信息
		sentman: {
			consignorId: '',
			consignee: '',
			consigneeMobile: '',
			consignorCompanyId: '' //发货人公司id，用于获取订单关联列表
		},

		// 货物信息
		goodsName: "",
		goodsWeight: '',
		goodsRemark: '',
		goodsImage: '',
		goodsType: '01',
		goodsTypeDesc: '', //货物类型其他描述

		otherShow: false, //其他那一栏显隐
		goodsInfo: {
			otherGoodsType: '',
			fileList: [],
			goodsType: [{
					text: '木料',
					value: '01'
				},
				{
					text: '油漆',
					value: '02'
				},
				{
					text: '家具',
					value: '03'
				},
				{
					text: '器械',
					value: '04'
				},
				{
					text: '纺织品',
					value: '05'
				},
				{
					text: '服装',
					value: '06'
				},
				{
					text: '其他',
					value: '07'
				},
			],

		},

		// 发货时间
		expectStartTime: '',
		expectEndTime: '',


		relationUser: [],
		time: {
			minHour: 0,
			maxHour: 24,
			minDate: new Date(1990, 1, 1).getTime(),
			maxDate: new Date(2099, 12, 31).getTime(),
			currentDate: new Date().getTime(),
			date_show: false,
			datetwo_show: false,
			// currentChoose: '',
		}
	},

	date() {
		this.setData({
			['time.date_show']: true
		})
	},

	toProcess() {
		wx.navigateTo({
			url: '../process/process'
		})
	},

	areaShow() {
		this.setData({
			area_show: true
		})
	},

	mudiShow() {
		this.setData({
			mudi_show: true
		})
	},

	onClose() {
		this.setData({
			area_show: false,
			mudi_show: false,
			['time.date_show']: false,
			['time.datetwo_show']: false
		})
	},

	// 货物图片上传时获取图片路径
	afterRead(event) {
		this.setData({
			goodsImage: event.detail.file.url
		})
		console.log(this.data.goodsImage);
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
				businessType: '01'
			},
			header: {
				'Authorization': wx.getStorageSync('token')
			},
			success: (res) => {
				// 上传完成需要更新 fileList
				const {
					fileList = []
				} = this.data;
				fileList.push({
					...file,
					url: res.data
				});
				this.setData({
					['goodsInfo.fileList']: fileList
				});
				console.log(this.data.goodsInfo.fileList);
			},
		});
	},

	// 删除上传的货物图片
	delete(e) {
		console.log(e);
		this.setData({
			['goodsInfo.fileList']: []
		})
	},

	startPliceChange(e){
			this.setData({
				shippingAddress:e.detail
			})
	},

	EndPliceChange(){
		this.setData({
			deliveryAddress:e.detail
		})
	},
	areaconfirm(res) {
		this.setData({
			area_show: false
		})
		console.log(res)
		let newarr = []
		res.detail.values.forEach(item => {
			newarr.push(item.name)
		})
		console.log(newarr);
		this.setData({
			shippingAddress: newarr.join('  ') + ' '
		})
	},

	mudiConfirm(res) {
		this.setData({
			mudi_show: false
		})
		console.log(res)
		let newarr = []
		res.detail.values.forEach(item => {
			newarr.push(item.name)
		})
		console.log(newarr);
		this.setData({
			deliveryAddress: newarr.join('  ') + ' '
		})
	},

	// 时间确定
	onConfirm(res) {
		this.setData({
			['time.date_show']: false
		})
		this.setData({
			expectStartTime: ss.formatTime(res.detail, 'Y年M月D日 h:m')
		})
	},

	datetwoShow() {
		this.setData({
			['time.datetwo_show']: true
		})
	},

	// 期望到达时间确定
	onConfirmhope(res) {
		this.setData({
			['time.datetwo_show']: false
		})
		this.setData({
			expectEndTime: ss.formatTime(res.detail, 'Y年M月D日 h:m')
		})
	},

	// 查询顶部发货人信息
	getInfo() {
		getUserInfo().then(res => {
			this.setData({
				['sentman.consigneeMobile']: res.data.consignorMobile,
				['sentman.consignee']: res.data.nickName,
				['sentman.consignorCompanyId']: res.data.consignorCompanyId
			})
			this.getAssociatedUserList()
		}).catch(err => {
			console.log(err);
		})
	},

	// 查询此订单的关联者列表
	getAssociatedUserList() {
		if (this.data.sentman.consignorCompanyId == null) {
			wx.showToast({
				title: '当前用户暂无企业',
				icon: 'none',
				duration: 2000
			})
		} else {
			getAssociatedUserList({
				consignorCompanyId: this.data.sentman.consignorCompanyId
			}).then(res => {
				this.setData({
					relationUser: res.data,
				})
			}).catch(err => {
				console.log(err);
			})
		}
	},

	// 发货人id数组
	userOnChange(e) {
		this.setData({
			result: e.detail,
		});
		console.log(this.data.result);
	},

	//货物类别改变
	goodsTypeValueChange(e) {
		this.setData({
			goodsType: e.detail,
		})
		console.log(this.data.goodsType);
		if (this.data.goodsType == '07') {
			this.setData({
				otherShow: true,
			})
		} else {
			this.setData({
				otherShow: false,
				goodsTypeDesc:''
			})
		}
	},

	// 货物品类其他说明变化时
	otherGoodsTypeChange(e) {
		this.setData({
			goodsTypeDesc: e.detail
		})
	},

	// 发起订单提交按钮
	tosent() {
		let obj = {
			goodsName: this.data.goodsName,
			goodsType: this.data.goodsType,
			goodsWeight: this.data.goodsWeight,
			goodsImage: this.data.goodsImage,
			goodsTypeDesc:this.data.goodsTypeDesc,
			goodsRemark:this.data.goodsRemark,
			shippingAddress: this.data.shippingAddress,
			deliveryAddress: this.data.deliveryAddress,
			...this.data.sentman,
			relationUser: this.data.result,
			expectStartTime: this.data.expectStartTime,
			expectEndTime: this.data.expectEndTime
		}
		if (this.data.orderId) {
			// 如果有订单id的话表明是编辑订单，调用编辑订单
			updateOrder({
				...obj,
				id:this.data.orderId
			}).then(res => {
				wx.showToast({
					title: '编辑成功',
					icon: 'none'
				})
			}).catch(err => {
				console.log(err)
			})
		} else {
			addWaybill({
				...obj
			}).then(res => {
				console.log(res);
				wx.showToast({
					title: '提交成功',
					icon: 'none'
				})
				wx.navigateTo({
					url: '../order-list/order-list?search_type=' + '01',
				})
			}).catch(err => {
				console.log(err);
			})
		}

	},

	// 订单列表编辑按钮传过来的时候查询订单详情
	getOrderDetail(id) {
		getOrderDetail(id).then(res => {
			let obj = res.data.bcdWaybill
			this.setData({
				shippingAddress: res.data.bcdWaybill.shippingAddress,
				deliveryAddress: res.data.bcdWaybill.deliveryAddress,
				['sentman.consignee']: res.data.bcdWaybill.consignee,
				['sentman.consignorId']: res.data.bcdWaybill.consignorId,
				['sentman.consigneeMobile']: res.data.bcdWaybill.consigneeMobile,
				goodsName: res.data.bcdWaybill.goodsName,
				goodsWeight: res.data.bcdWaybill.goodsWeight,
				goodsRemark: res.data.bcdWaybill.goodsRemark,
				goodsType: res.data.bcdWaybill.goodsType,
				goodsTypeDesc: res.data.bcdWaybill.goodsTypeDesc,
				expectStartTime: res.data.bcdWaybill.expectStartTime,
				expectEndTime: res.data.bcdWaybill.expectEndTime,
				result:res.data.bcdWaybill.relationUser
			})
			console.log(res.data.bcdWaybill.goodsType);
			console.log(res.data.bcdWaybill.goodsTypeDesc);
			if (this.data.goodsTypeDesc) {
				console.log(333333);
				this.setData({
					goodsType:res.data.bcdWaybill.goodsTypeDesc,
					otherShow:true
				})
			}else{
				this.setData({
					otherShow:false
				})
			}
		}).catch(err => {
			console.log(err);
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options.id);
		if (options.id == undefined || options.id == 'undefined') {
			console.log('没有订单');
			this.setData({
				orderId: null
			})
		} else {
			this.setData({
				orderId: options.id
			})
			this.getOrderDetail(options.id)
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
		// 查询顶部发货人信息
		this.getInfo()
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