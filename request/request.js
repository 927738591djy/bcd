// 引入env中的url
const {
  baseUrl
} = require('./env.js').dev; //这里上线的时候换成线上地址



module.exports = {
  /**
   * 二次封装wx.request
   * url:请求的接口地址
   * method:请求方式 GET,POST....
   *  data:要传递的参数
   * header:请求头
   */



  request: (url, method, data) => {

    // console.log('这是我封装的ajax请求', url, method, data, header);

    let _url = `${baseUrl}/${url}`; //这里使用ES6的写法拼接的字符串

    return new Promise((resolve, reject) => {
      // wx.showLoading({
      //     title: '正在加载',
      // })
      wx.request({
        url: _url,
        method: method,
        data: data,
        header: wx.getStorageSync('token')==''? {}:{
          'Authorization': wx.getStorageSync('token')
        },
        success: (res) => {
          // console.log('从接口获取到的数据', res);
          let data = res.data;
          if (res.statusCode == 200) {
            // wx.hideLoading();
            //统一拦截--------401未登录活登录已过期token过期
            if (data.code == 401) {
							// wx.hideLoading();
							// 没后台，先注释掉、
              // wx.reLaunch({
              //   url: '/pages/login/login?token=0', //拼接参数--表明是401--过去的
              // })
            }
            if (data.code == 200) {
              resolve(res.data);
              // wx.hideLoading();
              // wx.showToast({
              //     title: '请求成功',
              // })
            }
            if (data.code == 500) {
              wx.hideLoading();
              wx.showToast({
                title: data.msg ? data.msg :'操作失败',
                icon: 'none',
                duration: 2000
							})
            }
            if (data.code == 404) {
              // wx.hideLoading();
              wx.showToast({
                title: '参数效验失败',
                icon: 'none'
              })
            }
            if (data.code == 403) {
              // wx.hideLoading();
              wx.showToast({
                title: '没有相关权限',
                icon: 'none'
              })
            }
            if (data.code == 402) {
              wx.hideLoading();
              wx.showToast({
                title: '账户已禁用',
                icon: 'none'
              })
            }
          } else {
            // wx.hideLoading();
            wx.showToast({
              title: '请求有误',
              icon: 'none'
            })
          }
        },
        fail() {
          // wx.hideLoading();
          reject('发送失败');
          // wx.reLaunch({
          //   url: '/pages/login/login', //
          // })
          wx.showModal({
            title: '提示',
            content: '网络错误',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定');
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          })
        }
      });

    });
  },
}