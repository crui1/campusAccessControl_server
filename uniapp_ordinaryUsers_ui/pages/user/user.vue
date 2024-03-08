<template>
	<view class='all'>
		<!-- 基本信息 -->
		<view class="my-head">
			<view class='my-user-information'>
				<text class="tips">tips: 点击更换头像</text>
				<image @click="bindViewTap" class="userinfo-avatar"
					:src="require('../../static/headPortrait/default.png')" mode="cover">
				</image>
				<view v-if="userInfo.isTc">
					<view class="userinfo-name">{{userInfo.name}} 老师,欢迎您</view>
					<view>管理班级：{{userInfo.class? userInfo.class: '暂无'}}</view>
				</view>
				<view v-else>
					<view class="userinfo-name">{{userInfo.name}} 同学,欢迎您</view>
					<view>
						所在班级：{{userInfo.class? userInfo.class: '暂未分班'}}
					</view>
				</view>
			</view>
		</view>
		<!-- 通行申请按钮 -->
		<view v-if="!userInfo.isTc" @click="goEntry" class="my-block bord10">
			<image class="icon-w48" :src="require('../../static/myUser/keep.png')"></image>
			申请进出
			<image class="icon-goRight" :src="require('../../static/myUser/goRight.png')"></image>
		</view>
		<!-- 人脸信息 -->
		<view class="my-block bord10" @click="faceClick">
			<image class="icon-w48" :src="require('../../static/myUser/faceentry.png')"></image>
			人脸信息
			<image class="icon-goRight" :src="require('../../static/myUser/goRight.png')"></image>
		</view>
		<!-- 邮箱信息 -->
		<view @click="showEmailModal=!showEmailModal" class="my-block bord10">
			<image class="icon-help" :src="require('../../static/myUser/help.png')"></image>
			我的邮箱： {{userInfo.email||'未设置邮箱'}}
			<image class="icon-goRight" :src="require('../../static/myUser/goRight.png')"></image>
			<text class="tip">点击修改</text>
		</view>
		<!-- 修改密码按钮 -->
		<view @click="showPwdModal=!showPwdModal" class="my-block bord10">
			<image class="icon-w48" :src="require('../../static/myUser/buiness.png')"></image>
			修改密码
			<image class="icon-goRight" :src="require('../../static/myUser/goRight.png')"></image>
		</view>
		<!-- 退出登录按钮 -->
		<view @click="logout" class="my-block">
			<image class="icon-buiness" :src="require('../../static/myUser/logoff.png')"></image>
			退出登录
			<image class="icon-goRight" :src="require('../../static/myUser/goRight.png')"></image>
		</view>
		<!-- 邮箱模态框 -->
		<Modal @modalClick="handlerUpdateEmail" :is-show="showEmailModal">
			<template v-slot:title>
				<text>修改邮箱</text>
			</template>
			<template v-slot:main>
				<view class="row">
					<text>新邮箱：</text>
					<input class="input-inline-block" v-model.trim="newEmail" type="text" placeholder="请输入新邮箱" />
				</view>
			</template>
		</Modal>
		<!-- 密码模态框 -->
		<Modal @modalClick="handlerUpdatePwd" :is-show="showPwdModal">
			<template v-slot:title>
				<text>修改密码</text>
			</template>
			<template v-slot:main>
				<view class="row">
					<text>原密码：</text>
					<input class="input-inline-block" v-model.trim="updatePwd.oldPwd" type="text"
						placeholder="请输入原密码" />
				</view>
				<view class="row">
					<text>新密码：</text>
					<input class="input-inline-block" v-model.trim="updatePwd.newPwd" type="text"
						placeholder="请输入新密码" />
				</view>
				<view class="row">
					<text>确认密码：</text>
					<input class="input-inline-block" v-model.trim="updatePwd.reNewPwd" type="text"
						placeholder="请再次输入新密码" />
				</view>
			</template>
		</Modal>
	</view>
</template>

<script>
	let gld = getApp().globalData
	import {
		SUCCESSSTATE
	} from '../../constant/index.js'
	import {
		getUserInfo,
		uploadFile,
		upEmail,
		upPassword,
		upHeadPortrait
	} from '../../request/index.js'
	import {
		hex_md5 as md5
	} from "../../utils/md5.js"
	import Modal from "../../componets/Modal.vue"
	export default {
		components: {
			Modal
		},
		data() {
			return {
				showEmailModal: false,
				showPwdModal: false,
				newEmail: '',
				updatePwd: {
					oldPwd: '',
					newPwd: '',
					reNewPwd: '',
				},

				userInfo: gld.userInfo,
				default_pic: '../../static/headPortrait/default.png'
			}

		},
		created() {
			// this._getUserInfo()
		},
		methods: {
			// 发送请求获取用户信息
			async _getUserInfo() {

				const res = await getUserInfo()
				if (res.code == SUCCESSSTATE) {
					gld.userInfo = res.data
					console.log(res.data)
					this.userInfo = res.data
				}

			},
			// 退出
			logout(e) {
				// 取框本地存储和全局信息
				uni.removeStorageSync('token')
				gld.token = ''
				gld.userInfo = null

				uni.reLaunch({
					url: '../login/login',
				})
			},
			//更换头像
			async bindViewTap() {
				const choosed = await uni.chooseMedia({
					count: 1
				}).catch(() => {})
				if (!choosed) return
				let p = res.tempFiles[0].tempFilePath
				const res = await uploadFile({
					name: 'pic',
					filePath: p
				})
				if (res.code != SUCCESSSTATE) return
				const rest = await upHeadPortrait({
					pic: res.data.pic
				})
				if (rest.code == SUCCESSSTATE) {
					this._getUserInfo()
					uni.showToast({
						title: rest.message,
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: rest.message,
						icon: 'error'
					})
				}
			},


			// 通行申请
			goEntry(event) {
				let context = this
				uni.navigateTo({
					url: `/pages/application/application?name=${context.userInfo.name}&class=${context.userInfo.class}`
				})
			},
			// 人脸信息
			faceClick() {
				// uni.navigateTo({
				// 	url: '../face/face',
				// })
			},
			// 组件取消按钮,确认完后恢复数据
			clearData() {
				this.showEmailModal = false
				this.showPwdModal = false
				this.newEmail = ''
				this.updatePwd.oldPwd = ''
				this.updatePwd.newPwd = ''
				this.updatePwd.reNewPwd = ''
			},

			handlerUpdateEmail(sure) {
				if (sure) {
					this.changeEmail()
				} else {
					this.clearData()
				}
			},

			handlerUpdatePwd(sure) {
				if (sure) {
					this.changePwd()
				} else {
					this.clearData()
				}
			},
			//确定修改邮箱，发送请求
			async changeEmail() {
				let email = this.newEmail
				// 验证输入合法性
				let checked = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
				if (!email || !checked) {
					return uni.showToast({
						title: '请输入正确的邮箱!',
						icon: 'error',
						duration: 500
					})
				}
				// 合法发起请求
				const res = await upEmail({
					email
				})
				if (res.code == SUCCESSSTATE) {
					this.clearData()
					// 刷新用户数据
					this._getUserInfo()
					uni.showToast({
						title: res.message,
						icon: 'success',
						duration: 1000
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error',
						duration: 1000
					})
				}
			},

			async changePwd() {
				if (!this.updatePwd.oldPwd || !this.updatePwd.newPwd || !this.updatePwd.reNewPwd || this.updatePwd
					.newPwd != this.updatePwd.reNewPwd) return uni.showToast({
					title: '请正确输入表单',
					icon: 'none'
				});
				// 正确填写 发送请求
				const res = await upPassword({
					oldPwd: md5(this.updatePwd.oldPwd),
					newPwd: md5(this.updatePwd.newPwd),
					rePassword: md5(this.updatePwd.reNewPwd)
				})
				if (res.code == SUCCESSSTATE) {
					this.clearData()
					uni.showToast({
						title: res.message,
						icon: 'success',
						duration: 1000
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1000
					})
				}
			},
		},

	}
</script>

<style lang="less" scoped>
	@artSize: 100px;

	.row {
		display: flex;
		align-items: center;
		margin-top: 0.4rem;
	}

	.row:first-child {
		margin-top: 0;
	}

	.all {
		width: 100%
	}

	.my-user-information {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px 0;
		background-color: #FED61A;
	}

	.bindloge {
		width: 200rpx;
		height: 254rpx;
	}

	.userinfo-avatar {
		width: 130rpx;
		height: 130rpx;
		margin: 20rpx 0;
		border-radius: 50%;
		border: 5px solid rgb(246, 167, 64);
	}

	.input-inline-block {
		display: inline-block;
	}

	.userinfo-name {
		font-size: 15pt;
		margin-bottom: 10px;
	}

	.icon-w48 {
		width: 48rpx;
		height: 48rpx;
		margin-right: 30rpx;
	}

	.icon-goRight {
		width: 10rpx;
		height: 18rpx;
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.my-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 88rpx;
		line-height: 88rpx;
		padding-left: 30rpx;
		position: relative;
		font-size: 30rpx;
	}

	.bord10 {
		border-bottom: 10rpx solid #f5f5f5;
	}


	.icon-help {
		width: 50rpx;
		height: 50rpx;
		margin-right: 30rpx;
	}

	.icon-buiness {
		width: 50rpx;
		height: 50rpx;
		margin-right: 30rpx;
	}

	.tips {
		color: rgb(155, 155, 155);
	}

	.md {
		width: 90%;
		margin: 20rpx auto;
		display: flex;
		/* gap: 12rpx; */
		justify-content: flex-end;
	}

	.md .btn {
		margin-right: 12px;
	}

	.tip {
		position: absolute;
		right: 2rem;
		color: rgb(184, 184, 184);
		font-size: 9pt;
	}
</style>