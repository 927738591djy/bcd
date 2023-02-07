// pages/cargo/cargo.js
const tt = require('../../common/util2.js')
import amap from "../../js-sdk/js-amap/amap-wx.130.js";


const {
	evaluate,
	getOrderDetail,
	getEvaluate,
} = require('../../request/api.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		orderDetail: {
			shippingAddress: '', //发货地址
			deliveryAddress: '', //收货地址
			driverName: '', //司机名称
			driverAvator: '', //司机头像
			driverMobile: '', //司机手机
			waybillStatus: '', //订单状态
			goodsName: '', //货品名称
			goodsWeight: '', //货品重量
			waybillSn: '', //订单编号
			quotationAmount: '' //订单价格
		},
		trajectoryList: [], //轨迹数组
		star: '', //查询到的评价星级
		statusText: '',
		evaluateStar: '', //评价星级
		evaluateButtonShow: false, //评价按钮显不显示
		evaluateDetailShow: false, //评价详情显不显示
		isAssessSuccess: false, //是否评价成功
		pingjia_show: false,
		evaluateDialogShow: false,
		active: 2,
		steps: [],
		show: false,
		latitude: '', //收货地址纬度
		longitude: '', //收货地址经度
		polyline: [],
		markers: [],
		distance: '',
		cost: '', //花费时间
		timeDiatanceShow:true //时间或者距离显示吗
	},

	popup() {
		this.setData({
			show: true
		})
	},

	// 确认评价对话框弹出
	assessCommit() {
		this.setData({
			evaluateDialogShow: true
		})
	},

	// 确认评价点击确认回调
	confirmEvaluate() {
		evaluate({
			waybillSn: this.data.orderDetail.waybillSn,
			evaluateStar: this.data.evaluateStar
		}).then(res => {
			console.log(res);
			wx.showToast({
				title: '评价成功',
				icon: 'none'
      })
      this.setData({
        pingjia_show:false
      })
		}).catch(err => {
			console.log(err);
		})
	},

	// 评价星级改变
	evaluateChange(e) {
		this.setData({
			evaluateStar: e.detail
		})
	},

	onClose() {
		this.setData({
			show: false,
			pingjia_show: false
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var amapPlugin = new amap.AMapWX({
			key: "b6e500fcbe5a95d1da12b93fe760478a",
		});
		getOrderDetail(options.id).then(res => {
			this.setData({
				orderDetail: res.data.bcdWaybill,
        trajectoryList: res.data.trajectoryList,
			})
			
			// 如果轨迹数组长度小于0,时间距离不显示
			if(this.data.trajectoryList.length == 0){
				this.setData({
					timeDiatanceShow:false,
					trajectoryList:[{}],
					show:false
				})
			}else{
				this.setData({
					timeDiatanceShow:true
				})
			}

			let arr = res.data.trajectoryList.map(item => {
				let arr = []
				return item = {
					text: item.locationDetail,
					desc: item.createTime,
					inactiveIcon: 'location-o',
					activeIcon: 'success',
				}
			})
			this.setData({
				steps: arr
			})
			console.log(arr);
			// 将收货地址转为经纬度
			wx.request({
				url: `https://restapi.amap.com/v3/geocode/geo?address=${this.data.orderDetail.deliveryAddress}&output=JSON&key=180775be02d01ede08d821d7783e3325`,
				success: (res) => {
					console.log('地址');
					console.log(res);
					this.setData({
						longitude: (res.data.geocodes[0].location.split(','))[0],
						latitude: (res.data.geocodes[0].location.split(','))[1],
						markers: [{
							width: 35,
							height: 50,
							id: 0,
							latitude: this.data.trajectoryList[0].latitude, //货车司机所在的纬度
							longitude: this.data.trajectoryList[0].longitude, //货车司机所在的经度
							customCallout: {
								display: "ALWAYS"
							}
						}, {
							width: 35,
							height: 50,
							id: 1,
							latitude: (res.data.geocodes[0].location.split(','))[1], //收获地址所在的纬度
							longitude: (res.data.geocodes[0].location.split(','))[0], //收货地址所在的经度
							// customCallout: {
							// 	display: "ALWAYS"
							// }
						}],
					})

					// 获取两个地间的交通路线规划
					amapPlugin.getDrivingRoute({
						origin:this.data.trajectoryList[0].longitude + ',' + this.data.trajectoryList[0].latitude, //司机最近依次打卡的经纬度
						destination: `${this.data.longitude},${this.data.latitude}`, //收货地址经纬度
						success: (data) => {
							if (data.paths[0] && data.paths[0].distance) {
								this.setData({
									distance: parseInt(data.paths[0].distance / 1000) + 'km',
								});
							}

							if (data.paths[0] && data.paths[0].duration) {
								let result = tt.formatSeconds(data.paths[0].duration)
								this.setData({
									cost: tt.formatSeconds(data.paths[0].duration)
								});
							}
						},
						fail: function (info) {
							//失败回调
							console.log(info)
						}
					})

				},
				method: 'GET'
			})
			// 如果订单状态为 02已派单 03运货中 04已送达 就是已派单，不显示评价按钮
			//如果订单状态是 05已完成,就等于待评价，显示评价按钮，显示评价控件 。
			// 如果订单状态是06的话就是已评价，显示评价详情，不显示评价控件
			//如果订单状态为01的话就是待派单,不能点查看踪迹
			if (options.status == '02' || options.status == '03') {
				this.setData({
					evaluateButtonShow: false,
					statusText: '您的订单正在运输中'
				})
			} else if (options.status == '04') {
				this.setData({
					evaluateButtonShow: false,
					statusText: '您的订单已送达'
				})
			} else if (options.status == '06') {
				this.setData({
					evaluateButtonShow: true,
					evaluateDetailShow: true,
					isAssessSuccess: true,
					statusText: '您的订单已评价成功'
				})
				// 为6的话查看评价详情
				getEvaluate(options.id).then(res => {
					console.log(res);
					this.setData({
						star: res.data.evaluateStar
					})
				}).catch(err => {
					console.log(err);
				})
			} else if (options.status == '04' || options.status == '05') {
				this.setData({
					evaluateButtonShow: true,
					evaluateDetailShow: false,
					isAssessSuccess: false,
					statusText: '您的订单已送达'
				})
			}
		}).catch(err => {
			console.log(err);
		})

	},

	// 拨打司机电话
	call() {
		wx.makePhoneCall({
			phoneNumber: this.data.orderDetail.driverMobile //仅为示例，并非真实的电话号码
		})
	},

	pingjiaShow() {
		this.setData({
			pingjia_show: true
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