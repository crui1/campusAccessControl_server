<template>
	<view v-if="isShow" class="modalContainer">
		<!-- 蒙版 -->
		<view class="modalContent">
			<!-- 内容区 -->
			<view class="header">
				<slot name="title"></slot>
			</view>
			<view class="main">
				<slot name="main"></slot>
			</view>
			<view class="footer">
				<button plain type="primary" size="mini" @click="handlerClick(1)">确定</button>
				<button plain type="primary" size="mini" @click="handlerClick(0)">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isShow: {
				default: false,
				type: Boolean
			}
		},
		methods: {
			handlerClick(type) {
				// 传入点击事件按钮类型，1确定，0取消
				this.$emit("modalClick", type)
			}
		}
	}
</script>

<style lang="less" scoped>
	@pad: 6px;

	.modalContainer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		background: rgba(0, 0, 0, 0.2);

		.modalContent {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 85%;
			background: #fff;

			.header {
				display: flex;
				justify-content: flex-start;
				padding: @pad;
				font-weight: bold;
			}

			.main {
				padding: @pad;
				border: 0rem solid #dadada;
				border-width: 0.2rem 0;
			}

			.footer {
				display: flex;
				justify-content: flex-end;
				padding: @pad;
				column-gap: 8px;
			}
		}
	}
</style>