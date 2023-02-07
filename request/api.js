//引入封装的reuest请求
const {
	request
} = require('./request.js');

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';


//请求头根据自己的情况配置

//这个是发送登录请求的请求头不需要携带token
//const headerPost = {
//    'content-type': 'application/json',
//};

//这里的请求头需要携带token--但是直接在这里获取会有异步，所以我实在要请求数据的地方获取存在本地的token


// const headerPostToken = {
//     'content-type': 'application/json',
//     'QS_TOKEN': app.globalData.token
// };
// const headerGet = {
//     'content-type': 'application/x-www-form-urlencoded',
//     'QS_TOKEN': wx.getStorageSync('QS_TOKEN')
// };



//基于业务封装的接口
module.exports = {
	// 登录
	login(data, header) {
		return request('consignor/login', POST, data, header);
	},
	// 获取用户手机号
	getWxPhone(data) {
		return request('consignor/bindMobile', POST, data);
	},
	// 获取用户信息
	getUserInfo() {
		return request('consignor/info', GET);
	},
	// 修改用户信息
	updateUserInfo(data) {
		return request('consignor/update', POST, data);
	},

	//新增企业信息
	addCompany(data) {
		return request('company/add', POST, data);
	},

	// 查询企业信息
	searchCompanyDetail(id) {
		return request(`company/detail/${id}`, GET);
	},

	// 修改企业信息
	updateCompany(data) {
		return request(`company/update`, POST, data);
	},

	// 查询关联用户列表
	getAssociatedUserList(data) {
		return request(`consignor/getConsignorListByCompanyId`, GET, data);
	},

	// 新增企业关联用户
	addCompanyInvite(data) {
		return request(`companyInvite/add`, POST, data);
	},

	// 删除企业关联用户
	removeConsignor(data) {
		return request(`company/removeConsignor`, POST, data);
	},

	// 绑定企业
	bindCompany(data) {
		return request(`company/bindCompany`, POST, data);
	},

	// 添加订单
	addWaybill(data) {
		return request('waybill/add', POST, data);
	},
	// 查询订单列表
	getOrderList(data) {
		return request('waybill/list', GET, data);
	},

	// 查询订单详情
	getOrderDetail(id) {
		return request(`waybill/detail/${id}`, GET);
	},

	// 编辑订单(待派单)
	updateOrder(data) {
		return request('waybill/update', POST, data);
	},

	// 上传文件信息 
	upLoadFile(data) {
		return request('common/upload', POST, data);
	},

	// 查询订单轨迹
	trajectory(data) {
		return request('waybill/trajectory', GET, data);
	},


	// 评价订单
	evaluate(data) {
		return request('waybill/evaluateWaybill', POST, data);
	},

	// 查询评价订单
	getEvaluate(id) {
		return request(`waybill/waybillEvaluateDetail/${id}`, GET);
	},

	// 查询消息列表
	getMessageList(data) {
		return request('message/list', GET, data);
	},

	// 查询消息详情
	getMessageDetail(id) {
		return request(`message/detail/${id}`, GET);
	},

	// 删除消息
	removeMessage(id) {
		return request(`message/remove/${id}`, GET);
	},

	// 查询公告列表
	getNoticeList(data) {
		return request('notice/list', GET, data);
	},

	// 查询公告详情
	getNoticeDetail(id) {
		return request(`notice/detail/${id}`, GET);
	},

	// 删除公告
	removeNotice(id) {
		return request(`notice/remove/${id}`, GET);
	},

	// 新增企业关联用户
	addCompanyUser(data) {
		return request('company/user/add', POST, data);
	},

	// 删除企业关联用户
	removeCompanyUser(data) {
		return request('company/removeConsignor', POST, data);
	},

	// 修改用户信息
	updateConsignor(data) {
		return request('consignor/update', POST, data);
	},

	//退出登录
	logout(data) {
		return request('consignor/logout', POST, data);
	},

	//绑定企业
	bindCompany(data) {
		return request('company/bindCompany', POST, data);
	},

	//上传图片
	uploadImage(data) {
		return request('/wx/driver/storage', POST, data);
	},

	//确认送达
	confirmReceiptGoods(id) {
		return request(`waybill/confirmReceiptGoods/${id}`, GET);
	},

	//添加成员手机号
	inviteCompany(data) {
		return request('companyInvite/add', POST, data);
	},

	//查询成员列表
	getInviteCompanyList() {
		return request('companyInvite/list', GET);
	},

	//删除成员手机号
	deleteCompany(id) {
		return request(`companyInvite/remove/${id}`, GET);
	},
}