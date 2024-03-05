var app = getApp().globalData
import {SUCCESSSTATE} from "../../constant/index"
import { getUserInfo, uploadFile, upEmail, upPassword, upHeadPortrait } from '../../utils/api/index'
import {hex_md5 as md5} from "../../utils/md5/md5"
Page({
	data: {
		show: false,
		pwdshow: false,
		newEmail: '',
		oldPwd: '',
		newPwd: '',
		reNewPwd: '',
		userInfo: {},
		default_pic: '../../images/headPortrait/default.png'
	},
	onLoad: function () {
		this._getUserInfo()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}
	},
	// 发送请求获取用户信息
	async _getUserInfo() {
		const res = await getUserInfo()
		if (res.code == SUCCESSSTATE) {
			app.userInfo = res.data
			this.setData({
				userInfo: res.data
			})
		}
	},
	// 退出登录
	logoff: function (event) {
		wx.removeStorageSync('token')
		app.token = ''
		this.setData({
			userInfo: null,
		})

		wx.redirectTo({
			url: '../index/index',
		})
	},

	//更换头像
	bindViewTap: async function () {
		const res = await wx.chooseMedia({
			count: 1
		}).catch(() => { })
		if (!res) return
		let p = res.tempFiles[0].tempFilePath
		const res2 = await uploadFile({ name: 'pic', filePath: p })
		if (res2.code != 200) return
		const rest = await upHeadPortrait({ pic: res2.data.pic })
		if (rest.code == SUCCESSSTATE) {
			this._getUserInfo()
			wx.showToast({
				title: rest.message,
				icon: 'success'
			})
		} else if (rest.code != 403) {
			wx.showToast({
				title: rest.message,
				icon: 'error'
			})
		}
	},

	// 通行申请
	goEntry: function (event) {
		wx.navigateTo({
			url: `../goentry/goentry`
		})
	},
	// 人脸信息
	faceClick() {
		wx.navigateTo({
			url: '../face/face',
		})
	},
	// 邮箱图层显示
	businessInfo() {
		this.setData({
			show: true
		})
	},
	// 组件取消按钮
	cancel() {
		this.setData({
			show: false,
			pwdshow: false,
			newEmail: '',
			oldPwd: '',
			newPwd: '',
			reNewPwd: ''
		})
	},
	//确定修改邮箱，发送请求
	async changeEmail() {
		let email = this.data.newEmail.trim()
		// 验证输入合法性
		let res = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
		if (!email || !res) return wx.showToast({
			title: '请输入正确的邮箱!',
			icon: 'error',
			duration: 500
		})
		// 合法发起请求
		const res2 = await upEmail({ email })
		if (res2.code == SUCCESSSTATE) {
			this.cancel()
			// 刷新用户数据
			this._getUserInfo()
			wx.showToast({
				title: res2.message,
				icon: 'success',
				duration: 1000
			})
		} else if (res2.code != 403) {
			wx.showToast({
				title: res2.message,
				icon: 'error',
				duration: 1000
			})
		}
	},
	// 显示密码修改组件
	showPwdCmp() {
		this.setData({
			pwdshow: true
		})
	},
	// 确定修改密码
	async changePwd() {
		if (!this.data.oldPwd.trim() || !this.data.newPwd.trim() || !this.data.reNewPwd.trim() || this.data.newPwd.trim() != this.data.reNewPwd.trim()) return wx.showToast({
			title: '请正确输入表单',
			icon: 'none'
		})
		// 正确填写 发送请求
		const res = await upPassword({
			oldPwd: md5(this.data.oldPwd.trim()),
			newPwd: md5(this.data.newPwd.trim()),
			rePassword: md5(this.data.reNewPwd.trim())
		})
		if (res.code == SUCCESSSTATE) {
			this.cancel()
			wx.showToast({
				title: res.message,
				icon: 'success',
				duration: 1000
			})
		} else if (res.code != 403) {
			wx.showToast({
				title: res.message,
				icon: 'none',
				duration: 1000
			})
		}
	},
})
