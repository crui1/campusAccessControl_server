// const gld = getApp().globalData
import {
	INVALID
} from "../constant/index.js"
export const myRequest = ({
	url,
	method,
	data,
	header,
	timeout
}) => {
	const BASEURL = 'http://localhost:8081'
	// console.log("sdsds")
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		uni.request({
			method: method || 'GET',
			url: BASEURL + url,
			data,
			timeout: timeout || 2500,
			header: header || {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': uni.getStorageSync("token")
			},
			success: ({
				data
			}) => {
				console.log(data)
				// 令牌失效
				if (data.code == INVALID) {
					uni.removeStorageSync('token')
					gld.token = ''
					uni.reLaunch({
						url: '/pages/login/login',
						success: () => {
							uni.showToast({
								title: '登录信息无效,请重新登录',
								icon: 'none',
								duration: 2500
							})
						}
					})
					reject(data)
				}
				resolve(data)
			},
			fail: (err) => {
				console.log("5555555555555555")
				uni.showToast({
					title: '网络错误',
					icon: 'error',
					duration: 2000
				})
				reject(err)
			},
			complete: (res) => {
				console.log("777777")
				uni.hideLoading()
			}
		})
	})
}