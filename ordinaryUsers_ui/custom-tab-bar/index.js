const app = getApp().globalData
Component({
	data: {
		selected: 1,
		color: "#000000",
		roleId: '',
		selectedColor: "#fed61a",
		allList: [{
			student: [{
				pagePath: "/pages/history/history",
				text: "申请记录",
				iconPath: "/images/tabBar/icon_normal.png",
				selectedIconPath: "/images/tabBar/icon_pressed.png"
			}, {
				pagePath: "/pages/user/user",
				text: "个人中心",
				iconPath: "/images/tabBar/footer-icon-04.png",
				selectedIconPath: "/images/tabBar/footer-icon-04-active.png"
			}],

			teacher: [{
				pagePath: "/pages/admin/admin",
				text: "申请管理",
				iconPath: "/images/tabBar/footer-icon-door.png",
				selectedIconPath: "/images/tabBar/footer-icon-active_door.png"
			}, {
				pagePath: "/pages/user/user",
				text: "个人中心",
				iconPath: "/images/tabBar/footer-icon-04.png",
				selectedIconPath: "/images/tabBar/footer-icon-04-active.png"
			}]
		}],
		list: []
	},
	ready() {
		// console.log('在组件在视图层布局完成后执行')
		const Type = wx.getStorageSync('Type')
		if (Type == '1') {
			// console.log('切换为教师导航栏');
			this.setData({
				list: this.data.allList[0].teacher
			})
		} else {
			// console.log("学生导航栏")
			this.setData({
				list: this.data.allList[0].student
			})
		}
	},
	methods: {
		switchTab(e) {
			const { index, path } = e.currentTarget.dataset
			wx.switchTab({ url: path })
			this.setData({
				selected: index
			})
		}
	},
})