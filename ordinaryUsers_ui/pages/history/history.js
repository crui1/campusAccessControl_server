import { getApplication, cancelApp } from '../../utils/api/index'
import {SUCCESSSTATE} from "../../constant/index"
Page({
	data: {
		//   0:待审核 1:通过 2:不通过
		listData: []
	},
	onShow() {
		this._getDate()
		// 自定义tabbar索引
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}
	},
	onPullDownRefresh: function () {
		this._getDate()
	},
	async _getDate() {
		const res = await getApplication()
		if (res.code == SUCCESSSTATE) {
			this.setData({
				listData: res.data
			})
		} else if (res.code != 403) {
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
		// 		if (res.code == SUCCESSSTATE) {
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
	async cnacel({ currentTarget: { dataset: { id } } }) {
		const res = await cancelApp({ id })
		if (res.code == SUCCESSSTATE) {
			this._getDate()
		}
		wx.showToast({
			title: res.message,
			icon: 'none'
		})
	}
})