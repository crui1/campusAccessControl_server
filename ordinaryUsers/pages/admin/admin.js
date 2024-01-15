import { toExamineApp, getApplication } from '../../utils/api/index'
Page({
	data: {
		//   0:待审核 1:通过 2:不通过
		listData: [],
		remark: ''
	},
	onShow() {
		this._getData()
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}
	},
	onPullDownRefresh: function () {
		this._getData()
	},
	async _getData() {
		const res = await getApplication()
		if (res.code == 200) {
			this.setData({
				listData: res.data
			})
		} else {
			wx.showToast({
				title: res.message,
				icon: 'error',
				duration: 1500
			})
			console.log(res.message);
		}
		// wx.request({
		// 	url: api.getApp,
		// 	method: 'get',
		// 	header: {
		// 		'Authorization': app.token
		// 	},
		// 	success: ({ data: res }) => {
		// 		if (res.code == 200) {
		// 			this.setData({
		// 				listData: res.data
		// 			})
		// 		} else {
		// 			wx.showToast({
		// 				title: res.message,
		// 				icon: 'error',
		// 				duration: 1500
		// 			})
		// 			console.log(res.message);
		// 		}
		// 	}
		// })
	},
	// 同意
	agree({ currentTarget: res }) {
		res = res.dataset
		res.state = 1
		if (this.data.remark) res.tcRemark = this.data.remark
		this._postToExamine(res)
	},
	// 拒绝
	refuse({ currentTarget: res }) {
		res = res.dataset
		res.state = 2
		if (this.data.remark) res.tcRemark = this.data.remark
		this._postToExamine(res)
	},
	// 提交审核
	async _postToExamine(data) {
		const res = await toExamineApp(data)
		if (res.code == 200) {
			this._getData()
		}
	}
})