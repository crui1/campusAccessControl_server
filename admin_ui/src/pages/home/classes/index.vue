<template>
  <div class="class-info">
    <!-- 头部操作栏 -->
    <el-card class="class-head mag-bottom">
      <div class="add-search flex-between">
        <el-button @click="changeShowDialog" type="primary" size="small" plain
          >添加班级</el-button
        >
        <div>
          <el-select
            v-model="field"
            placeholder="选择查询字段"
            style="width: 100px"
          >
            <el-option label="班级号" value="id" />
            <el-option label="班级名" value="name" />
          </el-select>
          :
          <el-input
            placeholder="请输入查询关键字"
            prefix-icon="el-icon-search"
            v-model.trim="keyword"
            style="width: 260px"
            :clearable="true"
          >
          </el-input>
        </div>
      </div>
    </el-card>
    <!-- 班级展示表格 -->
    <el-card ref="classTable" class="class-content">
      <el-table
        :data="classes"
        :max-height="th"
        stripe
        row-key="id"
        style="width: 100%"
      >
        <el-table-column label="班级号" prop="id"></el-table-column>
        <el-table-column label="班级名" prop="name"></el-table-column>
        <el-table-column label="班主任">
          <template v-slot="{ row }">
            <span class="mgr">{{ row.tcName || "暂无" }}</span>
            <el-link
              v-if="row.tcID"
              @click="cancelTeacher(row.id, row.tcID)"
              type="warning"
              >撤销班主任</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delClass(row.id, row.tcID)"
            >
              <el-link class="mgr" type="danger" slot="reference"
                >删除班级</el-link
              >
            </el-popconfirm>
            <DropDown
              title="设置班主任"
              :selection="teachers"
              :additionalID="row.tcID"
              :infoID="row.id"
              @choose="alterHeadmaster"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加班级表单弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加班级"
      :show-close="false"
      :visible.sync="showDialog"
    >
      <el-form
        :rules="rules"
        :model="form"
        status-icon
        ref="classInfo"
        label-width="120px"
        @keyup.native.enter="submitForm('classInfo')"
      >
        <el-form-item prop="name" label="班级名称">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="id" label="班级号">
          <el-input v-model.trim="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="tcID">
          <el-select clearable v-model="form.tcID" placeholder="请选择班主任">
            <el-option
              :v-if="teachers.length > 0"
              v-for="i in teachers"
              :label="i.name"
              :value="i.account"
              :key="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submitForm('classInfo')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
import api from "@/api"
import DropDown from "@/components/DropDown.vue"
import { watch } from 'vue'
export default {
  name: 'Classes',
  data() {
    let checkClassID = (ruler, value, cb) => {
      if (!value) {
        return cb(new Error("班级号不能为空"))
      }
      if (value.length !== 8) {
        return cb(new Error("请输入8位班级号"))
      }
      if (!/^\d*$/.test(value)) cb(new Error('请输入数字型班级号'))
      cb()
    }
    return {
      th: 250,
      keyword: '',
      field: 'name',
      showDialog: false,
      form: {
        id: "",
        name: "",
        tcID: undefined
      },
      rules: {
        id: [
          { validator: checkClassID, trigger: 'blur', required: true }
        ],
        name: [
          { trigger: 'blur', required: true, message: '班级名不能为空' }
        ]
      }
    }
  },
  components: {
    DropDown
  },
  created() {
    if (!this.$store.state.classes.length) {
      this.getData()
    }
  },
  mounted() {
    let elObserver = elementResizeDetectorMaker({ strategy: "scroll" })
    elObserver.listenTo(this.$refs.classTable.$el, (() => {
      let __lastHeight
      return (el) => {
        if (__lastHeight === el.offsetHeight) return
        this.th = el.offsetHeight - 40
        __lastHeight = el.offsetHeight
      }
    })())
  },
  methods: {
    getData() {
      this.$store.dispatch('getTeachers')
      this.$store.dispatch('getClasses')
    },
    async delClass(id, tcID) {
      const res = await api.deleteClass({ id }).catch(err => { })
      if (res.code == 200) {
        this.$message.success("删除成功")
        if (tcID) this.getData()
        else this.$store.dispatch('getClasses')
        // 方便信息学生页面还是原班级分类来获取数据
        this.$bus.$emit('reGetStudent')
      }
    },
    changeShowDialog() {
      this.showDialog = !this.showDialog
    },
    async alterHeadmaster({ infoID, chooseID, additionalID }) {
      let data = { id: infoID, tcID: chooseID, originTcID: additionalID }
      const res = await api.alterClass(data).catch(() => { })
      if (res.code == 200) {
        this.$message.success("修改成功")
        this.getData()
      } else {
        this.$message.error("修改失败", error.$message)
      }
    },
    async cancelTeacher(id, tcID) {
      const res = await api.cancelHeadmaster({ id, tcID }).catch(err => { })
      if (res.code == 200) {
        this.$message.success("取消成功")
        this.getData()
      } else {
        console.log(res);
        this.$message.error("取消失败")
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.tcID) {
            this.form.tcID = undefined
          }
          this.addClass(this.form)
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    cancelAdd() {
      this.$refs.classInfo.resetFields()
      this.changeShowDialog()
    },
    async addClass(data) {
      const res = await api.addClass(data).catch(err => { })
      if (res.code == 200) {
        this.$message.success("添加成功")
        if (data.tcID) this.getData()
        else this.$store.dispatch('getClasses')

        this.$refs.classInfo.resetFields()
        this.changeShowDialog()
      } else {
        console.log(res)
        this.$message.error(res.message)
      }
    }
  },
  computed: {
    teachers: function () {
      return this.$store.state.teachers.filter(item => {
        return !item.classID
      })
    },
    classes: function () {
      return this.$store.state.classes
    }
  },
  watch: {
    keyword: function () {
      if (this.$timer) clearTimeout(this.$timer)
      this.$timer = setTimeout(() => {
        this.$store.dispatch('getClasses', { keyword: this.keyword, field: this.field })
        this.$timer = null
      }, 800)
    }
  }
}
</script>

<style lang="less" scoped deep>
.mgr {
  margin-right: 10px;
}
.my-c {
  margin-left: 10px;
  vertical-align: baseline;
}
.class-info {
  height: 100%;

  .class-content {
    height: calc(100% - 92px);
  }
}
</style>