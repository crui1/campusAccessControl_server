<template>
  <el-card class="login card-box">
    <div slot="header" class="clearfix">
      <span style="font-size: 16pt">管理员登录</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="goRegister"
        >点击注册</el-button
      >
      <span style="float: right; padding: 0 2px">没有账号?</span>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
      @keyup.native.enter="submitForm('ruleForm', $event)"
    >
      <el-form-item label="账号" prop="account">
        <el-input
          placeholder="请输入账号"
          v-model.trim="ruleForm.account"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          show-password
          v-model.trim="ruleForm.password"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import api from "@/api"
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) return callback(new Error('密码不能为空'))
      if (value.length < 6) return callback(new Error('请输入至少6位密码'))
      callback()
    }
    return {
      ruleForm: {
        password: '',
        account: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        account: [
          { message: '账号不能为空', trigger: 'blur', required: true }
        ]
      }
    }
  },
  beforeMount() {
    if (this.$store.state.token) {
      this.$router.replace('/home')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goLogin(this.ruleForm)
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async goLogin(data) {
      const res = await api.login(data).catch(() => { })
      if (res.code == 200) {
        this.$message.success('登录成功')
        localStorage.setItem('token', res.token)
        this.$store.commit("CHANGETOKEN", res.token)
        this.$router.replace({ name: 'home' })
        // location.reload()
      } else {
        this.$message.error(res.message)
      }
    },
    goRegister() {
      this.$router.replace({ name: 'register' })
    }
  }
}
</script>

<style lang="less">
</style>