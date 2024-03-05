<template>
	<transition name="slide-fade">
		<view class="picker-view-box">
			<view class="uni-padding-wrap">
				<view class="uni-title">请选择时期</view>
				<button class="button-ok" type="button" @click="handlerClick">确定</button>
			</view>
			<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in 24" :key="index">{{ftn(index)}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in 60" :key="index">{{ftn(index)}}分</view>
				</picker-view-column>
			</picker-view>
		</view>
	</transition>
</template>


<script>
	import {
		ftn,
		defaultDate
	} from "../utils/index.js"


	export default {
		props: {
			dateType: String,
			// visible: {
			// 	default: true
			// },
			startDate: {
				type: String,
				default: defaultDate(-1)
			},
			dateTime: {
				type: String,
				required: true
			},
			endDate: {
				type: String,
				default: defaultDate(+5)
			}
		},
		data() {
			const date = new Date(this.dateTime)
			console.log("DATA　数据", this.startDate)
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const day = date.getDate()
			let hh = date.getHours()
			let mm = date.getMinutes()
			for (let i = this.startDate.split(/[\/|-]/)[0]; i <= this.endDate.split(/[\/|-]/)[0]; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(ftn(i))
			}

			return {
				years,
				year,
				months,
				month,
				day,
				value: [years.indexOf(year), month - 1, day - 1, hh, mm],
				hh,
				mm,
				indicatorStyle: `height: 50px;`,
				ftn
			}
		},
		computed: {
			days() {
				console.log("计算")
				let num = new Date(this.year, this.month, 0).getDate()
				let days = []
				for (var i = 1; i <= num; i++) {
					days.push(ftn(i))
				}
				return days
			}
		},
		methods: {
			// 监听
			bindChange: function (e) {
				const val = e.detail.value
				// console.log(val)
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
				this.hh = ftn(val[3])
				this.mm = ftn(val[4])
			},

			handlerClick() {
				let dateStr = `${this.year}/${this.month}/${this.day} ${this.hh}:${this.mm}`
				let dateType = this.dateType
				uni.$emit("selected", {
					dateStr,
					dateType
				})
			}

		}
	}
</script>


<style lang="less" scoped>
	@titleSzie: 18px;

	.picker-view-box {
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 999;
		// box-shadow: 0 -5px -5px 0 black;


		.uni-title {
			font-size: @titleSzie;
		}

		.uni-padding-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0.3rem 0.5rem;
			border-bottom: 2px solid gray;
			border-top: 2px solid gray;
			// background-color: gray;

			.button-ok {
				font-size: @titleSzie;
				margin: 0;
				background-color: #00d466;
			}
		}
	}

	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}

	.item {
		line-height: 100rpx;
		text-align: center;
	}

	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {
		transition: all .3s ease;
	}

	.slide-fade-leave-active {
		transition: all .3s ease;
	}

	// 动画开始或结束状态
	.slide-fade-enter,
	.slide-fade-leave-to {
		transform: translateY(100px);
		opacity: 0;
	}
</style>