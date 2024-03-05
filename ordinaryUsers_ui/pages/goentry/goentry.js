const app = getApp().globalData
import {SUCCESSSTATE} from "../../constant/index"
import { postApplication } from '../../utils/api/index'
Page({
	data: {
		minDate: new Date().getTime(),
		startDate: new Date().getTime(),
		endDate: new Date().getTime(),
		times: '',
		reason: ''
	},
	onLoad() {
		console.log(app);
		let info = app.userInfo
		this.setData({
			name: info.name,
			class: info.class
		})
	},
	// 点击显示修改时间
	selectTime(e) {
		let id = e.currentTarget.dataset.id
		this.setData({
			flag: true,
			id,
			titleText: id == 1 ? '选则开始时间' : '选择结束时间'
		})
	},
	// 直接关闭选择器
	onClose() {
		this.setData({
			flag: 0
		})
	},
	// 选择器 确定按钮
	changeTime(e) {
		if (this.data.id == 1) {
			this.setData({
				flag: 0,
				startDate: e.detail
			})
		} else {
			this.setData({
				flag: 0,
				endDate: e.detail
			})
		}

	},

	// 提交申请
	submit:async function (event) {
		if (this.data.startDate >= this.data.endDate) return wx.showToast({
			title: '请选择正确的起止时间段',
			icon: 'none'
		})
		if (!this.data.times.trim()) {
			return wx.showToast({
				title: '请输入通行趟数',
				icon: 'none',
				duration: 1500
			})
		}
		if (!this.data.reason) {
			return wx.showToast({
				title: '请输入通行理由',
				icon: 'none'
			})
		}
		const res = await postApplication({
			name: this.data.name,
			validityDate: `${this.data.startDate}/${this.data.endDate}`,
			time: this.data.times * 2,
			reason: this.data.reason,
		})
		if (res.code == SUCCESSSTATE) {
			wx.showToast({
				title: res.message,
				icon: 'success',
				duration: 1500,
				success: () => {
					setTimeout(() => {
						wx.switchTab({
							url: '../user/user',
						})
					}, 1500)
				}
			})
		} else if (res.code != 403) {
			wx.showToast({
				title: res.message,
				icon: 'error',
				duration: 1500
			})
		}
	}
})