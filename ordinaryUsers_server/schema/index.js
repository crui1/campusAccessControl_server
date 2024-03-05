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
const password = joi.string().min(6).required()
const account = joi.string().alphanum().min(8).max(10).required()
const schema = {
    // 公用
    reg_register: {
        body: {
            isTc: joi.boolean().required(),
            name: joi.string().min(2).max(12).required(),
            account,
            classID: joi.string().min(8).max(8),
            password: password,
            rePassword: joi.ref('password')
        }
    },
    reg_login: {
        body: {
            account,
            password: password,
            isTc: joi.boolean().required()
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
            rePassword: joi.ref('newPwd')
        }
    },
    up_pic: {
        body: {
            pic: joi.string().uri().required()
        }
    },
    // 学生表单校验规则
    postApp: {
        body: {
            // name: joi.string().min(2).max(12).required(),
            validityDate: joi.string().required(),
            time: joi.string().alphanum().required(),
            reason: joi.string().required()
        }
    },
    cancelApp: {
        body: {
            id: joi.number().required()
        }
    },
    // 教师表单校验规则
    alterApp: {
        body: {
            state: joi.number().min(1).max(2).required(),
            id: joi.number().required(),
            tcRemark: joi.string()
        }
    }
}
module.exports = schema