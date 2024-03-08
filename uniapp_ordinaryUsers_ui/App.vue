<script>
	import {
		getUserInfo
	} from "./request/index.js"
	import {
		SUCCESSSTATE
	} from "./constant/index.js"
	export default {
		globalData: {
			userInfo: null
		},
		onLaunch: function () {
			console.log('App onLaunch')
			this.initApp()
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},

		methods: {
			async initApp() {
				let token = uni.getStorageSync("token")
				if (token != '') {
					const res = await getUserInfo()
					console.log("----///", res);
					if (res.code == SUCCESSSTATE) {
						this.globalData.userInfo = res.data
						uni.switchTab({
							url: '/pages/user/user',
						})
					}

				}
			}
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	:root {
		font-size: 15px; //37.5rem --> 375
	}

	button {
		margin: 0;
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