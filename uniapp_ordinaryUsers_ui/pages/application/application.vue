<template>
	<view>
		<view class='all-other'>
			<view class='visitors'>
				<view class='visitors-information'>申请信息</view>
				<view class='visitors-detail'>
					<view class="fiexd">姓名: {{name}}</view>
					<view class="fiexd">专业班级: {{className}}</view>
					<view>
						<text>通行趟数: </text>

						<input auto-focus v-model="times" type="number" placeholder="请输入通行趟数" />
					</view>
					<view @click="selectTime" data-id="1">开始时间: {{startDate}}</view>
					<view @click="selectTime" data-id="2">结束时间: {{endDate}}</view>
					<textarea style="background: rgb(241, 241, 241);padding: 10px; width: 100%;box-sizing: border-box"
						maxlength="50" placeholder="请输入通行理由... " v-model="reason"></textarea>
				</view>
			</view>
		</view>
		<view class='button-submit'>
			<view class='total-price'></view>
			<view class='buying' @click='submit'>
				<text>提交申请</text>
			</view>
		</view>
		<!-- 自定义时期选择器 -->
		<DateTime :dateType="dateType" :dateTime="startDate" v-show="showable" />
	</view>

</template>

<script>
	import DateTime from "../../componets/DateTime.vue"

	import {
		ft,
		defaultDate
	} from "../../utils/index.js"

	import {
		postApplication
	} from "../../request/index.js"

	import {
		SUCCESSSTATE,
		ERRORSTATE
	} from "../../constant/index.js"
	export default {
		components: {
			DateTime
		},
		data() {
			console.log("dddd", defaultDate(0));
			return {
				ft,
				showable: false,
				dateType: "1", // 点击的类型 1 开始 2 结束 
				// minDate: Date.now(),
				// 通行时间段
				startDate: defaultDate(0),
				endDate: defaultDate(0),
				times: '',
				reason: '',

				name: '', // 姓名
				className: '' // 班级名
			}
		},
		onLoad() {
			// 注册监听日期选择器确定事件
			uni.$on("selected", (data) => {
				this.showable = !this.showable
				if (data.dateType === "1") {
					// 开始时间
					this.startDate = data.dateStr
				} else {
					this.endDate = data.dateStr
				}
			})
		},
		onUnload() {
			// 移除监听器
			console.log("卸载页面")
			uni.$off("selected")
		},
		created() {
			this.name = this.$route.query.name
			this.className = this.$route.query.class

		},

		methods: {
			// 点击显示修改时间
			selectTime(e) {
				this.dateType = e.currentTarget.dataset.id
				this.showable = true
			},

			// 提交申请
			async submit(event) {
				let startTimeStamp = new Date(this.startDate).getTime()
				let endTimeStamp = new Date(this.endDate).getTime()
				if (startTimeStamp >= endTimeStamp) return uni.showToast({
					icon: "error",
					title: '请选择正确的起止时间段',
				})
				if (!this.times.trim()) {
					return uni.showToast({
						title: '请输入通行趟数',
						icon: 'error',
						duration: 1500
					})
				}
				if (!this.reason) {
					return uni.showToast({
						title: '请输入通行理由',
						icon: 'error'
					})
				}
				const res = await postApplication({
					validityDate: `${startTimeStamp}/${endTimeStamp}`,
					time: this.times * 2,
					reason: this.reason,
				})
				if (res.code == SUCCESSSTATE) {
					uni.showToast({
						title: res.message,
						icon: 'success',
						duration: 1500,
						success: () => {
							setTimeout(() => {
								uni.switchTab({
									url: '../user/user',
								})
							}, 1500)
						}
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error',
						duration: 1500
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.all-other {
		width: 100%;
		background: -webkit-linear-gradient(top, #FED61A, #fff);
		display: flex;
	}

	.all-other .visitors {
		width: 100%;
		background: #fff;
		border-radius: 40rpx;
		padding: 40rpx;
		margin: 60rpx 40rpx;
	}

	.visitors .visitors-information {
		font-size: 36rpx;
		font-weight: bolder;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 2rpx solid #D3D5D7;
	}

	.visitors-detail {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}


	.button-submit {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 110rpx;
		background-color: #fff;
	}

	.button-submit .total-price {
		flex: 1;
		padding-left: 60rpx;
		padding-top: 30rpx;
	}

	.buying {
		text-align: center;
		font-size: 28rpx;
		background-color: #FED61A;
		border-radius: 20rpx;
		line-height: 80rpx;
		margin-right: 40rpx;
		height: 80rpx;
		width: 160rpx;
	}

	.fiexd {
		color: rgb(131, 131, 131);
	}
</style>