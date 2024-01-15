const express = require('express')
const router = express.Router()
const adminHandler = require('../router_handler/admin')

const expressJoi = require('@escook/express-joi')
// 规则
const { addAccount, addClass, deleteClass, alterClass, deleteAccount, alterAccount } = require('../schema')

// 查询信息接口
router.get('/getClasses', adminHandler.get('class'))
router.get('/getStudents', adminHandler.get('students'))
router.get('/getTeachers', adminHandler.get('teachers'))

// 添加信息接口
// 需要参数验证
router.post('/addClass', expressJoi(addClass), adminHandler.add('class'))
router.post('/addStudent', expressJoi(addAccount(10)), adminHandler.add('students'))
router.post('/addTeacher', expressJoi(addAccount(8)), adminHandler.add('teachers'))

// 删除信息接口
// 需要参数验证
router.post('/deleteClass', expressJoi(deleteClass), adminHandler.delete('class'))
router.post('/deleteStudent', expressJoi(deleteAccount), adminHandler.delete('students'))
router.post('/deleteTeacher', expressJoi(deleteAccount), adminHandler.delete('teachers'))

//修改 管理的账户和班级信息
// 需要验证表单信息
// 设置班级班主任
router.post('/alterClass', expressJoi(alterClass), adminHandler.updateClass)
router.post('/cancelHeadmaster', expressJoi(alterClass), adminHandler.cancelHeadmaster)
router.post('/alterStudent', expressJoi(alterAccount), adminHandler.update('students'))

module.exports = router