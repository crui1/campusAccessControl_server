// 信息处理
exports.ERRORSTATE = 0; // 处理失败
exports.SUCCESSSTATE = 1; // 处理成功
// 0: 待审核, 1:审核通过, 2:不通过 3:撤销申请
exports.PENDINGREVIEW = 0;
exports.APPROVED = 1;
exports.REFUSER = 2;
exports.REVOKE = 3;
// 登录鉴权token
exports.EFFECTIVE = 1; // 有效
exports.INVALID = 401; // 无效
