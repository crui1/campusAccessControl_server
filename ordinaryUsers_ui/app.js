App({
	globalData: {
		userInfo: null,
		token: null,
	},
	onLaunch() {
		let tk = wx.getStorageSync('token')
		if (tk) {
			this.globalData.token = tk
		}
	}
})