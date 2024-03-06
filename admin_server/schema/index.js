// 导入定义验证规则的包
const joi = require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// 定义各种验证规则
const name = joi.string().min(2).max(16).required()
const adminAccount = joi.string().alphanum().min(6).max(6).required()
const classID = joi.string().min(8).max(8).required()
const AccountId = joi.number().required()
const password = joi.string().min(6).required()
const schema = {
    register: {
        body: {
            name,
            account: adminAccount,
            password: password,
            checkPass: joi.ref('password'),
            registrationCode: joi.string().required()
        }
    },
    login: {
        body: {
            account: joi.string().alphanum().required(),
            password: password,
        }
    },
    up_email: {
        body: {
            email: joi.string().email().required()
        }
    },
    up_password: {
        body: {
            oldPwd: password,
            newPwd: joi.not(joi.ref('oldPwd')).concat(password),
            checkPass: joi.ref('newPwd')
        }
    },
    up_pic: {
        body: {
            pic: joi.string().uri().required()
        }
    },
    up_nickname: {
        body: {
            name: joi.string().required()
        }
    },

    //管理员 管理信息 验证规则
    addAccount: (length) => ({
        body: {
            name,
            account: joi.string().alphanum().min(length).max(length).required(),
            password: password,
            checkPass: joi.ref('password'),
            classID: joi.string().min(8).max(8)
        }
    }),
    deleteAccount: {
        body: {
            id: AccountId,
            classID: joi.string().min(8).max(8),
            account: joi.string().min(8).max(8)
        }
    },
    alterAccount: {
        id: AccountId,
        classID,
    },
    addClass: {
        body: {
            id: classID,
            name,
            tcID: joi.string().min(8).max(8)
        }
    },
    deleteClass: {
        body: {
            id: classID
        }
    },
    alterClass: {
        body: {
            id: classID,
            tcID: joi.string().required(),
            originTcID: joi.string().min(8).max(8)
        }
    }
}
module.exports = schema;