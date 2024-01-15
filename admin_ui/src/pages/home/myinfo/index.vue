<template>
  <div class="userInfo">
    <div class="left">
      <el-card style="height: 440px">
        <div class="admin">超级管理员</div>
        <div class="pic">
          <el-avatar
            :size="200"
            :src="
              info.pic ||
              'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            "
          ></el-avatar>
        </div>
        <span class="line"></span>
        <div class="base-info">
          <div>
            <i>昵称：</i>
            <div>{{ info.name }}</div>
          </div>
          <div>
            <i>邮箱：</i>
            <div>
              {{ info.email || "暂未设置" }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right">
      <el-card>
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <h5>基本信息修改</h5>
              <i class="header-icon el-icon-postcard"></i>
            </template>
            <div>
              <el-form
                label-position="left"
                :model="emailForm"
                :inline="true"
                ref="emailForm"
                label-width="80px"
              >
                <el-form-item
                  prop="email"
                  label="新邮箱"
                  :rules="[
                    {
                      required: true,
                      message: '请输入邮箱地址',
                      trigger: 'blur',
                    },
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input
                    placeholder="请输入邮箱"
                    v-model="emailForm.email"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subEmail('emailForm')"
                    >提交</el-button
                  >
                  <el-button @click="resetForm('emailForm')">清空</el-button>
                </el-form-item>
              </el-form>
              <el-form
                label-position="left"
                :model="nicknameForm"
                :inline="true"
                ref="nicknameForm"
                label-width="80px"
              >
                <el-form-item
                  prop="name"
                  label="新昵称"
                  :rules="[
                    {
                      required: true,
                      message: '请输入昵称',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input
                    placeholder="请输入昵称"
                    v-model="nicknameForm.name"
                    auto-complete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subNickname('nicknameForm')"
                    >提交</el-button
                  >
                  <el-button @click="resetForm('nicknameForm')">清空</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <h5>密码修改</h5>
              <i class="header-icon el-icon-key"></i>
            </template>
            <div>
              <el-form
                label-position="left"
                :model="passForm"
                :rules="passRules"
                ref="passForm"
                label-width="80px"
              >
                <el-form-item label="原密码" prop="oldPwd">
                  <el-input
                    type="password"
                    v-model="passForm.oldPwd"
                    autocomplete="off"
                    placeholder="请输入原密码"
                  ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                  <el-input
                    type="password"
                    v-model="passForm.newPwd"
                    placeholder="请输入新密码"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input
                    type="password"
                    v-model="passForm.checkPass"
                    placeholder="请再次新输入密码"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="alterPwd('passForm')"
                    >修改</el-button
                  >
                  <el-button @click="resetForm('passForm')">清空</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
import api from "@/api"
export default {
  name: "userInfo",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
          callback(new Error('请输入至少6位密码'))
        } else {
          if (this.passForm.checkPass !== '') {
            this.$refs.passForm.validateField('checkPass');
          }
          callback();
        }
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.passForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      emailForm: {
        email: ""
      },
      passForm: {
        oldPwd: "",
        newPwd: "",
        checkPass: ""
      },
      headPortraitForm: {
        pic: ''
      },
      nicknameForm: {
        name: ""
      },
      passRules: {
        oldPwd: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        newPwd: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    subEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goUpEmail(this.emailForm)
        } else {
          console.log('error submit!!')
        }
      })
    },
    alterPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goUpPass(this.passForm)
        } else {
          console.log('error submit!!')
        }
      })
    },
    subNickname(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goUpNickname(this.nicknameForm)
        } else {
          console.log('error submit!!')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async goUpEmail(data) {
      const res = await api.upEmail(data).catch(e => { })
      if (res.code == 200) {
        this.$store.dispatch('getUserInfo')
        this.$message.success(res.message)
        this.resetForm('emailForm')
      } else {
        this.$message.error(res.message)
      }
    },
    async goUpPass(data) {
      const res = await api.upPwd(data).catch(() => { })
      if (res.code == 200) {
        this.$message.success(res.message)
        this.resetForm('passForm')
      } else {
        this.$message.error(res.message)
      }
    },
    async goUpNickname(data) {
      const res = await api.upNickname(data).catch(e => { })
      if (res.code == 200) {
        this.$store.dispatch('getUserInfo')
        this.$message.success(res.message)
        this.resetForm('nicknameForm')
      } else {
        this.$message.error(res.message)
      }
    }
  },
  computed: {
    info: function () {
      return this.$store.state.userInfo
    }
  }
}
</script>

<style lang="less" scoped deep>
.userInfo {
  display: grid;
  grid-template-columns: 250px auto;
  gap: 10px;
  .left {
    .line {
      display: block;
      margin: 13px 0;
      border-bottom: 1px dashed rgb(194, 194, 194);
    }
    .admin {
      text-align: center;
      font-size: 17pt;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .base-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: rgb(160, 160, 160);
      i {
        font-weight: bold;
        color: black;
      }
    }
  }
  .right {
    h5 {
      margin: 0 10px;
    }
    .header-icon {
      font-size: 20pt;
    }
  }
}
</style>