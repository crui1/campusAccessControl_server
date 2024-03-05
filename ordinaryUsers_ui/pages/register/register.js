// const app = getApp()
// const api = require('../../utils/api/user')
import { register, getClasses } from '../../utils/api/index'
import {SUCCESSSTATE} from "../../constant/index"
import {hex_md5 as md5} from "../../utils/md5/md5"
Page({
	data: {
		account: '',
		password: '',
		passwordConfirm: '',
		name: '',
		position: '',
		show: false,
		classID: -1,

		columns: [],
		classIDs: [],
		classInfo: [],
		isTc: false
	},

	onLoad: function (options) {
		// 获取班级信息
		this._getClass()
	},
	async _getClass() {
		const res = await getClasses()
		if (res.code == SUCCESSSTATE) {
			this.setData({
				classInfo: res.data
			})
			this._handleClasse()
		}	
	},

	_handleClasse() {
		let columns = []
		let classIDs = []
		this.data.classInfo.forEach(it => {
			if (this.data.isTc) {
				if (!it.tcID) {
					columns.push(it.name)
					classIDs.push(it.id)
				}
			} else {
				columns.push(it.name)
				classIDs.push(it.id)
			}
		})
		this.setData({
			classIDs,
			columns
		})
	},
	// 改变账户类型
	_changeType(e) {
		if (e.detail.selectId) {
			this.setData({
				isTc: true
			})
		} else {
			this.setData({
				isTc: false
			})
		}
		this._handleClasse()

	},
	// 获取输入账号 
	accountInput: function (e) {
		this.setData({
			account: e.detail.value
		})
	},

	// 获取输入密码 
	passwordInput: function (e) {
		this.setData({
			password: e.detail.value
		})
	},
	passwordInputConfirm: function (e) {
		this.setData({
			passwordConfirm: e.detail.value
		})
	},

	// 获取姓名
	nameIt(e) {
		this.setData({
			name: e.detail.value
		})
	},
	// 显示班级选择器
	showPopup() {
		this.setData({
			show: true,
			position: 'down'
		})
	},
	// 关闭选择器
	onClose() {
		this.setData({
			show: false,
			position: ''
		})
	},

	// 获取班级
	onChange(event) {
		const { index } = event.detail;
		this.setData({
			classID: index
		})
	},
	// 表单验证
	checkForm() {
		if (this.data.account.length == 0 || this.data.password.length == 0 || !this.data.name.trim()) {
			wx.showToast({
				title: '请填写完整信息',
				icon: 'none',
				duration: 2000
			})
			return false
		} else if (this.data.password != this.data.passwordConfirm) {
			wx.showToast({
				title: '两次密码不相同',
				icon: 'none',
				duration: 2000
			})
			return false
		} else if (this.data.isTc) {
			if (this.data.account.length !== 8) {
				wx.showToast({
					title: '请输入8位数的工号',
					icon: 'none'
				})
				return false
			}
		} else if (!this.data.isTc) {
			if (this.data.account.length !== 10) {
				wx.showToast({
					title: '请输入10位数的学号',
					icon: 'none'
				})
				return false
			}
		}
		return true
	},

	// 注册
	onregisterClick: async function () {
		let valid = this.checkForm()
		let data = {
			isTc: this.data.isTc,
			account: this.data.account,
			password: md5(this.data.password),
			repassword: md5(this.data.passwordConfirm),
			name: this.data.name
		}
		if (this.data.classID !== -1) data.classID = this.data.classIDs[this.data.classID]
		if (valid) {
		const res = await	register(data)
		if (res.code==200) {
			wx.showToast({
			  title: '注册成功',
			  icon: 'success',
			  duration: 2500,
			})
			setTimeout(()=>{
				wx.navigateBack({
					delta: 1,
				  })
			},3000)
		}
			// wx.request({
			// 	url: api.register,
			// 	method: 'post',
			// 	data,
			// 	header: {
			// 		'content-type': 'application/x-www-form-urlencoded' // 默认值
			// 	},
			// 	success(res) {
			// 		if (res.data.code == "200") {
			// 			wx.showToast({
			// 				title: '注册成功',
			// 				icon: 'success',
			// 				duration: 2500,
			// 				success() {
			// 					setTimeout(function () {
			// 						wx.navigateBack({
			// 							delta: 1  // 返回上一级页面。
			// 						})
			// 					}, 2500);
			// 				}
			// 			})
			// 		} else {
			// 			wx.showToast({
			// 				title: res.data.message,
			// 				icon: 'none',
			// 				duration: 2500
			// 			})
			// 		}
			// 	}
			// })
		}
	}

})