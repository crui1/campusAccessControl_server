<template>
	<view class="container">

		<view class="login-icon">
			<image class="login-img" :src="require('../../static/login/pp.jpg')"></image>
		</view>
		<view class="login-from">
			<!-- 账户类型选择器 -->
			<!-- <my-selector title="账户类型：" placeholder="选择登录账户类型" @handleChange="typeChange" class="selector"></my-selector> -->

			<!--账号-->
			<view class="inputView">
				<image class="nameImage" :src="require('../../static/login/name.png')"></image>
				<label class="loginLab">账号</label>
				<input class="inputText" placeholder="请输入账号" v-model="username" />
			</view>
			<view class="line">
			</view>

			<!--密码-->
			<view class="inputView">
				<image class="keyImage" :src="require('../../static/login/key.png')"></image>
				<label class="loginLab">密码</label>
				<input class="inputText" password="true" placeholder="请输入密码" v-model="password" />
			</view>

			<!--按钮-->
			<view class="loginBtnView">
				<button class="loginBtn" type="primary" @click="handlerLogin">登录</button>

				<button class="registerBtn" type="primary" :disabled="true" @click="register">注册账号</button>
			</view>

		</view>
	</view>
</template>

<script>
	const gld = getApp().globalData
	import {
		hex_md5 as md5
	} from "../../utils/md5.js";
	import {
		SUCCESSSTATE
	} from "../../constant/index.js"
	import {
		login
	} from "../../request/index.js"
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		onLoad() {
			// 生命周期函数--监听页面显示
			if (gld.token) {
				uni.switchTab({
					url: '/pages/user/user',
				})
			}
		},
		methods: {
			register() {
				uni.navigateTo({
					url: '../register/register',
				})
			},
			// 表单校验
			checkForm() {
				console.log(this.username);
				if (this.username.length == 0 || this.password.length == 0) {
					uni.showToast({
						title: '账号或密码不能为空',
						icon: 'none',
						duration: 2000
					})
					return false
				}
				return true
			},

			// 登录处理
			async handlerLogin() {
				let valid = this.checkForm()
				if (valid) {
					const data = await login({
						account: this.username,
						password: md5(this.password),
					})
					if (data.code == SUCCESSSTATE) {
						// 本地存token
						uni.setStorageSync('token', data.token)
						uni.setStorageSync('Type', this.isTc ? '1' : '0')
						gld.token = data.token
						uni.switchTab({
							url: '../user/user'
						})
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: data.message,
							icon: 'error',
							duration: 1500
						})
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	/*登录图片*/
	.login-icon {

		flex: none;
	}

	.login-img {
		width: 100%;
		height: 320rpx;
	}

	/*表单内容*/
	.login-from {
		margin-top: 20px;
		flex: auto;
		height: 100%;
	}

	.inputView {
		/* background-color: #fff;  */
		width: 98%;
		margin: 0 auto;
		line-height: 45px;
		border-radius: 20px;
		border: 1px solid #999999;
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
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		margin-top: 0px;
		margin-bottom: 0px;
		padding-bottom: 0px;

		// >uni-button {
		// 	margin-top: 4rem auto;
		// }
	}

	.loginBtn {
		width: 98%;
		margin: 0 auto;
		margin-top: 4rem;
		border-radius: 1rem;
	}

	.registerBtn {
		width: 98%;
		margin: 0 auto;
		margin-top: 1rem;
		border-radius: 1rem;
	}
</style>