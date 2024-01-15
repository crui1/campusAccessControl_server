<template>
  <el-dialog
    :title="this.aType == 1 ? '添加学生账号' : '添加教师账号'"
    :show-close="false"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    @close="resetForm"
  >
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      :label-width="formLabelWidth"
    >
      <el-form-item label="姓名" prop="name">
        <el-input autocomplete="off" v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input autocomplete="off" v-model.trim="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model.trim="form.password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model.trim="form.checkPass"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="选择班级" prop="classID">
        <el-select clearable v-model="form.classID" placeholder="请选择班级">
          <el-option
            :v-if="options.length > 0"
            v-for="i in options"
            :label="i.name"
            :value="i.id"
            :key="i.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AccountDialog",
  props: ['dialogFormVisible', 'options', 'aType'],
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
          callback(new Error('请输入至少6位密码'))
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      let len = 8
      if (this.aType == 1) len = 10
      if (value.length != len) {
        return callback(new Error(`请输入${len}位数的账号`))
      }
      setTimeout(() => {
        if (!/^\d*$/.test(value)) {
          callback(new Error('请输入数字型账号'));
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      form: {
        account: "",
        name: "",
        password: "",
        checkPass: "",
        classID: ""
      },
      show: false,
      formLabelWidth: '120px',
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
        name: [{ message: '姓名不能为空', trigger: 'blur', required: true }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.classID) this.form.classID = undefined
          // this.goAdd(this.form)
          this.$emit('onSubmit', { ...this.form })
          // this.$nextTick(() => {
          //   this.$refs.form.resetFields()
          //   this.show = false
          // })
        } else {
          console.log('error submit!!')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    cancel() {
      this.$emit("closeDialog")
    }
  }
}
</script>

<style>
</style>