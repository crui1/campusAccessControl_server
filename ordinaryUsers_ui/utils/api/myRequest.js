const app = getApp().globalData
console.log(app);
// const FlieBaseUrl = 'http://localhost:8088'
const UserBaseUrl = 'http://192.168.43.24:8081'

export const uploadfile = (opt) => {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			filePath: opt.filePath,
			name: opt.name,
			url: opt.url,
			timeout: 5000,
			header: {
				'Authorization': app.token
			},
			success: ({ data: res }) => {
				res = JSON.parse(res)
				console.log(res)
				resolve(res)
			},
			fail: (err) => {
				wx.showToast({
					title: '网络错误',
					icon: 'error'
				})
				reject(err)
			},
		})
	})
}
export const myRequest = (opt) => {
	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		wx.request({
			method: opt.method || 'GET',
			url: UserBaseUrl + opt.url,
			data: opt.data,
			timeout: 5000,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': app.token
			},
			success: ({ data }) => {
				console.log(data);
				if (data.code == 403) {
					wx.removeStorageSync('token')
					app.token = ''
					wx.reLaunch({
						url: '/pages/index/index',
						success: ()=>{
							wx.showToast({
								title: '登录信息无效,请重新登录',
								icon: 'none',
								duration: 2500
							})
						}
					})
				}
				resolve(data)
			},
			fail: (err) => {
				wx.showToast({
					title: '网络错误',
					icon: 'error',
					duration: 2000
				})
				reject(err)
			},
			complete: (res) => {
				wx.hideLoading()
			}
		})
	})
}