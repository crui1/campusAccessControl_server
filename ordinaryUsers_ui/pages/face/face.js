import { alterFacePic, getFaceInfo, postFacePic } from '../../utils/api/index'
import {SUCCESSSTATE} from "../../constant/index"
Page({
	data: {
		src: null,
		info: "网络错误",
		pz: false,
		pzbox: true,
		existence: false,
	},
	onLoad() {
		this._getFaceInfo()
	},
	// 拍照
	record: function () {
		let ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				this.setData({
					src: res.tempImagePath,
					pzbox: false
				})
			}
		})
	},
	// 添加人脸
	async addFace() {
		if (!this.data.src) return
		const res = await postFacePic({ name: 'pic', filePath: this.data.src })
		if (res.code == SUCCESSSTATE) {
			this.data.url = ''
			this.setData({S
				pz: false,
				pzbox: true
			})
			wx.showToast({
				title: '添加人脸信息成功',
				icon: 'success',
				duration: 1500,
			})
			this._getFaceInfo()
		} else if(res.code!=403) {
			wx.showToast({
				title: '人脸添加失败',
				icon: 'error',
				duration: 2000
			})
		}
	},
	// 修改人脸信息
	async alterFaceInfo() {
		if (!this.data.src) return
		const res = await alterFacePic({ name: 'pic', filePath: this.data.src })
		if (res.code == SUCCESSSTATE) {
			this.data.url = ''
			this.setData({
				pz: false,
				pzbox: true
			})
			wx.showToast({
				title: '修改人脸信息成功',
				icon: 'success',
				duration: 1500,
			})
			this._getFaceInfo()
		} else if (res.code != 403) {
			wx.showToast({
				title: '修改失败',
				icon: 'error',
				duration: 2000
			})
		}
	},
	// _查询人脸信息
	async _getFaceInfo() {
		const res = await getFaceInfo()
		if (res.code == SUCCESSSTATE) {
			this.setData({
				info: "已有人脸相关信息",
				existence: true
			})
		} else if (res.code != 403) {
			this.setData({
				info: res.message,
				existence: false
			})
		}
	},
	// 开启相机
	startpt() {
		this.setData({
			pz: true
		})
	}
})