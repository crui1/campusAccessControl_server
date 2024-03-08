<template>
	<view class="box">
		<view v-if="!listData.length">没有更多信息了...</view>
		<view class="card2" v-for="(item,id) in listData" :key="id">
			<view class="title">
				<view v-if="item.state==1" class="name green">{{userInfo.isTc?item.name+"的申请&nbsp;&nbsp;":""}}已通过</view>
				<view v-if="item.state==2" class="name red">{{userInfo.isTc?item.name+"的申请&nbsp;&nbsp;":""}}未通过</view>
				<view v-if="item.state==0" class="name orange flex">
					<!-- 教师查看记录要显示学生名字 -->
					{{userInfo.isTc?item.name+"的申请&nbsp;&nbsp;":""}}待审核
					<button v-if="!userInfo.isTc" @click="handlerRevoke(item.id)" plain>撤销</button>
					<view v-else class="btn-group">
						<button plain type="warn" @click="handlerReview(item.id,2)">拒绝</button>
						<button plain type="primary" @click="handlerReview(item.id,1)">同意</button>
					</view>

				</view>

				<view v-if="item.state==3" class="name gray">{{userInfo.isTc?item.name+"的申请&nbsp;&nbsp;":""}}已撤销</view>
			</view>
			<view class="card-content">
				<view class="line">
					<text>通行次数：</text>
					<text>{{item.time}}</text>
				</view>
				<view class="line">
					<text>审核时间：</text>
					<view>{{item.reviewDate?ft(item.reviewDate):"暂无"}}</view>
				</view>
				<view class="line">
					<text>有效期：</text>
					<view>{{splitf(item.validityDate)}}</view>
				</view>
				<view class="mini-container">
					<view class="mini-card">
						<text class="title">申请理由</text>
						<view class="mini-content">{{item.reason}}</view>
					</view>
					<view v-if="item.state==0 && userInfo.isTc" class="mini-card">
						<text class="title">添加备注</text>
						<textarea v-model="tcRemark" class="mini-content" placeholder="输入备注..."></textarea>
					</view>
					<view v-else class="mini-card">
						<text class="title">审核备注</text>
						<view class="mini-content">{{item.tcRemark||'无'}}</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let gld = getApp().globalData
	import {
		ft,
		splitf
	} from "../../utils/index.js"
	import {
		getApplication,
		cancelApp,
		toExamineApp
	} from "../../request/index.js"
	import {
		SUCCESSSTATE,
		ERRORSTATE,
		APPROVED,
		REFUSER
	} from "../../constant/index.js"
	export default {
		data() {
			return {
				listData: [],
				ft,
				splitf,
				tcRemark: "",
				userInfo: gld.userInfo
			}
		},
		onLoad() {
			// 加载时，只有一次
			this.getData()
		},
		onShow() {
			this.getData()
		},

		onPullDownRefresh() {
			console.log("Refresh")

			setTimeout(function () {
				console.log(525121245565)
				uni.stopPullDownRefresh();
			}, 600);

			this.getData()


		},

		updated() {
			console.log("updated", this.listData)
		},
		methods: {
			// 获取申请记录数据
			getData() {
				console.log(gld.userInfo, "562666545");
				if (gld.userInfo.isTc && gld.userInfo.is_master) {
					// 是班主任
					this.initData({
						class_id: gld.userInfo.class_id,
						is_master: gld.userInfo.is_master
					})
				} else if (!gld.userInfo.isTc) {
					// 是学生
					this.initData()
				} else {
					uni.showToast({
						title: "没有相关权限",
						icon: "error"
					})
				}
			},
			async initData(data = null) {
				let res = await getApplication(data)
				console.log("-------", res);
				if (res.code == SUCCESSSTATE) {
					console.log("++++++", res.data);
					this.listData = res.data
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error',
						duration: 1500
					})
					console.log(res.message);
				}
			},
			// 学生撤销申请
			async handlerRevoke(id) {
				// 申请记录id
				const res = await cancelApp({
					id
				})
				if (res.code == SUCCESSSTATE) {
					this.initData()
				}
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			},

			// 教师审核
			handlerReview(app_log_id, button_id_state) {
				// 申请记录的app_log_id
				// 同意还是不同意 按钮  button_id_state
				// 向后端传入的数据
				let data = {
					id: app_log_id,
					state: button_id_state
				}
				if (this.tcRemark) data.tcRemark = this.tcRemark
				this.postToExamine(data)
			},

			// 教师提交审核
			async postToExamine(data) {
				const res = await toExamineApp(data)
				if (res.code == SUCCESSSTATE) {
					this.tcRemark = ""
					this.initData({
						class_id: gld.userInfo.class_id,
						is_master: gld.userInfo.is_master
					})
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.box {
		padding-bottom: 52px;
	}

	.card2 {
		border-radius: 10px;
		margin: 10px 6px;
		padding: 8px;
		box-shadow: 0 1px 10px 1px #424242;
	}

	.card2 .name {
		text-align: center;
		font-size: 15pt;
		font-weight: bold;
		margin-bottom: 6px;
		padding-bottom: 6px;
		border-radius: 3px;
		border-bottom: 4px dotted gray;
	}

	.card2>.card-content .line {
		width: fit-content;
		padding: 6px;
		margin-bottom: 6px;
		border-radius: 6px;
		background-color: #e5f7f8;
		box-shadow: inset 0 0 6px gray;
	}

	.card2>.card-content .line view {
		color: rgb(100, 100, 100);
	}

	.card2 text {
		font-size: 13pt;
	}

	.mini-container {
		display: flex;
		justify-content: space-between;
		column-gap: 6px;
	}

	.mini-container .mini-card {
		width: 49%;
		height: 120px;
		padding: 1px;
		border-radius: 6px;
		background-color: #e5f7f8;
		box-shadow: inset 0 0 6px #525252;
	}

	.mini-container .mini-card .title {
		display: block;
		text-align: center;
	}

	.mini-container .mini-card .mini-content {
		height: 80%;
		border-radius: 6px;
		padding: 6px;
		/* background-color: #def1f1; */
		box-shadow: inset 0 0 6px #acc8c8;
		box-sizing: border-box;
	}

	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.btn-group {
		display: flex;
		gap: 6px;
	}

	.mini-content {
		width: 100%;
	}

	.green {
		color: rgb(3, 202, 3);
	}

	.red {
		color: red;
	}

	.orange {
		color: orange;
	}

	.gray {
		color: gray;
		text-decoration: line-through coral;
	}
</style>