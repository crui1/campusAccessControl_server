<template>
	<view class="container">
		<view class="login-icon">
			<image class="login-img" :src="requier('../../static/images/login/kk.jpg')"></image>
		</view>
		<view class="login-from">
			<!-- 账户类型 -->
			<!-- <my-selector title="账户类型：" @handleChange="_changeType"></my-selector> -->
			<!-- 班级选择器-->
			<!-- <van-popup show="{{ show }}" position="bottom" custom-style="height: 30%;" @close="onClose">
				<van-picker columns="{{ columns }}" default-index="{{ 0 }}" @change="onChange" />
			</van-popup> -->
			<!-- 班级展示 -->
			<!-- <van-cell title="选择班级:" is-link title-class="cell-title" value-class="cell-value"
				value="{{columns[classID]}}" arrow-direction="{{position}}" @click="showPopup" /> -->
			<view class="line"></view>

			<!-- 姓名 -->
			<view class="inputView">
				<image class="nameImage" :src="requier('../../static/images/login/name.png')"></image>
				<label class="loginLab">姓名</label>
				<input class="inputText" placeholder="请输入姓名" v-model="nameIt" />
			</view>
			<!--学号-->
			<view class="inputView">
				<image class="nameImage" :src="requier('../../static/images/login/name.png')"></image>
				<label class="loginLab">账号</label>
				<input class="inputText" placeholder="请输入学号/工号" v-model="accountInput" />
			</view>


			<!--密码-->
			<view class="inputView">
				<image class="keyImage" :src="requier('../../static/login/key.png')"></image>
				<label class="loginLab">密码</label>
				<input class="inputText" password="true" placeholder="请输入密码" v-model="passwordInput" />
			</view>
			<view class="inputView">
				<image class="keyImage" :src="requier('../../static/images/login/key.png')"></image>
				<label class="loginLab">密码</label>
				<input class="inputText" password="true" placeholder="再次输入密码" v-model="passwordInputConfirm" />
			</view>

			<!--按钮-->
			<view class="loginBtnView">
				<button class="loginBtn" type="primary" :size="primarySize" :loading="loading" :plain="plain"
					:disabled="disabled" @click="onregisterClick">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		SUCCESSCODE,
		FAILCODE
	} from "../../constants/index.js"
	import {
		getClasses
	} from "../../request/index.js"
	const md5 = (eee) => {}
	export default {
		data() {
			return {
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
			}
		},
		methods: {
			async _getClass() {
				const res = await getClasses()
				if (res.code == SUCCESSCODE) {
					this.classInfo = res.data

					this._handleClasse()
				}
			},

			_handleClasse() {
				let columns = []
				let classIDs = []
				this.classInfo.forEach(it => {
					if (this.isTc) {
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

			// 表单验证
			checkForm() {
				if (this.account.length == 0 || this.password.length == 0 || !this.name.trim()) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none',
						duration: 2000
					})
					return false
				} else if (this.password != this.passwordConfirm) {
					uni.showToast({
						title: '两次密码不相同',
						icon: 'none',
						duration: 2000
					})
					return false
				} else if (this.isTc) {
					if (this.account.length !== 8) {
						uni.showToast({
							title: '请输入8位数的工号',
							icon: 'none'
						})
						return false
					}
				} else if (!this.isTc) {
					if (this.account.length !== 10) {
						uni.showToast({
							title: '请输入10位数的学号',
							icon: 'none'
						})
						return false
					}
				}
				return true
			},

			// 注册
			async onregisterClick() {
				let valid = this.checkForm()
				let data = {
					isTc: this.isTc,
					account: this.account,
					password: md5(this.password),
					repassword: md5(this.passwordConfirm),
					name: this.name
				}
				if (this.classID !== -1) data.classID = this.classIDs[this.classID]
				if (valid) {
					const res = await register(data)
					if (res.code == 200) {
						uni.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 2500,
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 3000)
					}
					// uni.request({
					// 	url: api.register,
					// 	method: 'post',
					// 	data,
					// 	header: {
					// 		'content-type': 'application/x-www-form-urlencoded' // 默认值
					// 	},
					// 	success(res) {
					// 		if (res.data.code == "200") {
					// 			uni.showToast({
					// 				title: '注册成功',
					// 				icon: 'success',
					// 				duration: 2500,
					// 				success() {
					// 					setTimeout(function () {
					// 						uni.navigateBack({
					// 							delta: 1  // 返回上一级页面。
					// 						})
					// 					}, 2500);
					// 				}
					// 			})
					// 		} else {
					// 			uni.showToast({
					// 				title: res.data.message,
					// 				icon: 'none',
					// 				duration: 2500
					// 			})
					// 		}
					// 	}
					// })
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		height: 100%;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 0;
		box-sizing: border-box;
		/* background-color: rgb(156, 23, 78) */
	}

	/*登录图片*/
	.login-icon {
		flex: none;
	}

	.login-img {
		width: 750rpx;
		height: 320rpx;
	}

	.cell-title {
		font-size: 12pt !important;
		color: black;
		font-weight: bold;
		margin-left: -10rpx !important;
	}

	.cell-value {
		color: rgb(126, 126, 126) !important;
		font-size: 11pt !important;
	}

	/*表单内容*/
	.login-from {
		margin-top: 20px;
		flex: auto;
		height: 100%;
	}

	.inputView {
		line-height: 45px;
		border-radius: 20px;
		border: 1px solid #999;
		margin: 10px 0;
	}

	/*输入框*/
	.nameImage,
	.keyImage {
		margin-left: 22px;
		width: 18px;
		height: 16px
	}

	.loginLab {
		margin: 15px 15px 15px 10px;
		color: #545454;
		font-size: 14px
	}

	.inputText {
		flex: block;
		float: right;
		text-align: right;
		margin-right: 22px;
		margin-top: 11px;
		color: #cccccc;
		font-size: 14px
	}

	.line {
		margin-top: 8px;
	}

	/*按钮*/
	.loginBtnView {
		width: 100%;
		height: auto;
		/* background-color:#DCDCDC;  */
		margin-top: 0px;
		margin-bottom: 0px;
		padding-bottom: 0px;
	}

	.loginBtn {
		width: 90%;
		margin-top: 20px;
		border-radius: 10px;
	}
</style>