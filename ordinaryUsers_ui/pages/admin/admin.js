var globalData = getApp().globalData
import { toExamineApp, getApplication } from '../../utils/api/index'
import {SUCCESSSTATE} from "../../constant/index"
Page({
	data: {
		//   0:待审核 1:通过 2:不通过
		listData: [],
		remark: ''
	},
	onShow() {
		console.log(globalData.userInfo.is_master)
		if (globalData.userInfo.is_master) {
			console.log("有权限，获取数据")
			this._getData()
		}else{
			wx.showToast({
			  title: '没有相关权限',
			  icon: "error"
			})
		}
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}
	},
	onPullDownRefresh: function () {
		if (globalData.userInfo.is_master) {
			console.log("有权限，获取数据")
			this._getData()
		}else{
			wx.showToast({
				title: '没有相关权限',
				icon: "error",
			  })
		}
	},
	async _getData() {
		const res = await getApplication({class_id: globalData.userInfo.class_id,
		is_master: globalData.userInfo.is_master
		})
		if (res.code == SUCCESSSTATE) {
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
		if (res.code == SUCCESSSTATE) {
			this._getData()
		}
	}
})