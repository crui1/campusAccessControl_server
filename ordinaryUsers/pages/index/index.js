const app = getApp().globalData
import {login} from '../../utils/api/index'
import md5 from 'md5'
Page({
	data: {
		username: '',
		password: '',
		typelist: [{ name: '教职工', id: 1 }, { name: '学生', id: 0 }],
		isTc: false
	},
	onLoad: function () {
		// 生命周期函数--监听页面显示
		if (app.token) {
			wx.switchTab({
				url: '/pages/user/user',
			})
		}
	},
	// 账户类型切换
	typeChange(e) {
		if (e.detail.selectId == 0) {
			this.setData({
				isTc: false
			})
		} else {
			this.setData({
				isTc: true
			})
		}
	},

	// 获取输入账号 
	usernameInput: function (e) {
		this.setData({
			username: e.detail.value
		})
	},

	// 获取输入密码 
	passwordInput: function (e) {
		this.setData({
			password: e.detail.value
		})
	},

	register: function () {
		wx.navigateTo({
			url: '../register/register',
		})
	},
	// 表单校验
	checkForm() {
		if (this.data.username.length == 0 || this.data.password.length == 0) {
			wx.showToast({
				title: '账号或密码不能为空',
				icon: 'none',
				duration: 2000
			})
			return false
		}
		return true
	},

	// 登录处理
	login:async function () {
		let valid = this.checkForm()
		if (valid) {
			const data = await login( {
				account: this.data.username,
				password: md5(this.data.password),
				isTc: this.data.isTc
			})
			if (data.code == 200) {
				// 本地存token
				wx.setStorageSync('token', data.token)
				wx.setStorageSync('Type', this.data.isTc ? '1' : '0')
				app.token = data.token
				wx.switchTab({
					url: '../user/user'
				})
				wx.showToast({
					title: '登录成功',
					icon: 'success',
					duration: 2000
				})
			} else if(data.code!=403){
				wx.showToast({
					title: data.message,
					icon: 'error',
					duration: 1500
				})
			}
		}
	}
})