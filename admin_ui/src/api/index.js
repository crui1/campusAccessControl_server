import request from '@/utils/request'

export default {
  // 管理员账户接口
  login: data => request({ method: 'post', url: '/api/login', data }),
  register: data => request({ method: 'post', url: '/api/register', data }),
  getUserInfo: () => request({ method: 'get', url: '/my/getUserInfo' }),
  upEmail: data => request({ method: 'post', url: '/my/upEmail', data }),
  upPic: data => request({ method: 'post', url: '/my/upPic', data }),
  upPwd: data => request({ method: 'post', url: '/my/upPwd', data }),
  upNickname: data => request({ method: 'post', url: '/my/upNickname', data }),

  // _________________________  管理员管理信息接口  ________________________
  getClasses: ({ keyword, field }) => request({ method: 'get', url: '/admin/getClasses', params: { keyword, field } }),
  getStudents: ({ classID }) => request({ method: 'get', url: '/admin/getStudents', params: { classID } }),
  getTeachers: ({ keyword }) => request({ method: 'get', url: '/admin/getTeachers', params: { keyword } }),

  // 
  addClass: data => request({ method: 'post', url: '/admin/addClass', data }),
  addStudent: data => request({ method: 'post', url: '/admin/addStudent', data }),
  addTeacher: data => request({ method: 'post', url: '/admin/addTeacher', data }),
  // 
  deleteClass: data => request({ method: 'post', url: '/admin/deleteClass', data }),
  deleteStudent: data => request({ method: 'post', url: '/admin/deleteStudent', data }),
  deleteTeacher: data => request({ method: 'post', url: '/admin/deleteTeacher', data }),
  // 
  alterClass: data => request({ method: 'post', url: '/admin/alterClass', data }),
  cancelHeadmaster: data => request({ method: 'post', url: '/admin/cancelHeadmaster', data }),
  alertStudent: data => request({ method: 'post', url: '/admin/alterStudent', data })
}
