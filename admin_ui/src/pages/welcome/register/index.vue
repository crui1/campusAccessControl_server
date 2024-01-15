<template>
  <el-card class="register card-box">
    <div slot="header" class="clearfix">
      <span style="font-size: 16pt">管理员注册</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="goLoginPage"
        >返回登录</el-button
      >
      <span style="float: right; padding: 0 2px">已有账号?</span>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
      @keyup.native.enter="submitForm('ruleForm')"
    >
      <el-form-item label="昵称" prop="name">
        <el-input
          clearable
          placeholder="请输入昵称"
          v-model.trim="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input
          clearable
          placeholder="请输入6位数字账号"
          v-model.trim="ruleForm.account"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          clearable
          placeholder="请输入邮箱"
          type="email"
          v-model.trim="ruleForm.email"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          clearable
          show-password
          v-model.trim="ruleForm.password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          clearable
          show-password
          v-model.trim="ruleForm.checkPass"
          autocomplete="off"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="注册码" prop="registrationCode">
        <el-input
          clearable
          placeholder="请输入注册码"
          v-model.trim="ruleForm.registrationCode"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >注册</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import api from '@/api'
export default {
  name: "Register",
  data() {
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      if (value.length != 6) {
        return callback(new Error('请输入6位数的账号'))
      }
      setTimeout(() => {
        if (!/^\d*$/.test(value)) {
          callback(new Error('请输入数字型账号'))
        } else {
          callback()
        }
      }, 1000)
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
          console.log(value);
          callback(new Error('请输入至少6位密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      ruleForm: {
        name: '',
        password: '',
        checkPass: '',
        account: '',
        email: '',
        registrationCode: '',
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur', required: true }
        ],
        registrationCode: [{ trigger: 'blur', required: true, message: '注册码不能为空' }],
        email: [{ type: 'email', trigger: 'blur', required: true, message: "请输入正确的邮箱" }],
        name: [{ trigger: 'blur', required: true, message: "昵称不能为空" }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register(this.ruleForm)
        } else {
          console.log('error submit!!')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async register(data) {
      const res = await api.register(data).catch(() => { })
      console.log(res)
      if (res.code == 200) {
        this.$message.success('注册成功,3s后返回登录页')
        this.$store.state.token = res.token
        setTimeout((
          this.$router.replace({ name: 'login' })
        ), 3000)
      }
    },
    goLoginPage() {
      this.$router.replace({ name: 'login' })
    }
  }
}
</script>
