<script>
	export default {
		globalData: {
			userInfo: null,
			token: ""
		},
		onLaunch: function () {
			let token = uni.getStorageSync("token")
			console.log(this.globalData);
			if (token != "") {
				this.globalData.token = token
			}
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	:root {
		font-size: 10px; //37.5rem --> 375
	}

	.content {
		/* 
		NavBar 44px
		tabBar 50px */
		/* 
		 uni-app方的高度，这里指的是H5，和APP。至于各家小程序，由于受导航栏右侧胶囊的影响，目前组件内部给安卓设定的导航栏高度为48px，iOS设定的导航栏高度为44，这是结合了大量的 实践的出来的结果，具备完好的兼容性。
		 */
		height: calc(100vh - (44px + 50px));
		/* background: gray; */
	}

	uni-button {
		margin: 0;
	}
</style>