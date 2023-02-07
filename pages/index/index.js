// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const {
  getUserInfo,
  getWxPhone,
  login
} = require('../../request/api.js');


Page({
  data: {
    isApprove: 0, //根据userInfo里面isCompany，判断是否显示企业入驻
    consignorCompanyId: "", //发货人公司id
    consignorMobile: '',
    avatarUrl: defaultAvatarUrl,
    nickName: '', //昵称表单值
    mobile: '', //用户手机号
    token: '' //是否登录过了
  },
  //跳转到发起订单
  tosent() {
    wx.navigateTo({
      url: '../sent/sent',
    })
  },

  toProcess(e) {
    wx.navigateTo({
      url: '../process/process?consignorCompanyId=' + e.currentTarget.dataset.set + '&companyPhone=' + this.data.consignorMobile,
    })
  },

  onGetPhoneNumber(e) {
    if (e.detail.encryptedData && e.detail.iv) {
      wx.login({
        success: (res) => {
          if (res.code) {
            let code = res.code // 登录凭证code
            login({
              wxCode: code
            }).then(res => {
              if (res.code == 200) {
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('id', res.data.bcdConsignor.id)
                this.setData({
                  avatar: res.data.bcdConsignor.avatar,
                  nickName: res.data.bcdConsignor.nickName,
                  isApprove: res.data.bcdConsignor.isCompany,
                })
                console.log(this.data.avatar);
                console.log(this.data.nickName)
                getWxPhone({
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  nickName: this.data.nickName,
                  avatar: this.data.avatarUrl
                }).then(res => {
                  if (res.code == 200) {
                    console.log("获取手机号");
                    console.log(res);
                    this.setData({
                      mobile: res.data.mobile
                    })
                    wx.setStorageSync('mobile', this.data.mobile)
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }).catch(err => {
              console.log(err);
            })
          }

        }
      })
    }
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

  onLoad() {


  },

  onShow() {
    console.log("主页onShow执行");
    this.setData({
      token: wx.getStorageSync('token'),
      mobile: wx.getStorageSync('mobile')
    })

  },

})