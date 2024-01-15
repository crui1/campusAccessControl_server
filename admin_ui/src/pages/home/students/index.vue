<template>
  <div class="students">
    <!-- 头部操作栏 -->
    <el-card class="stu-header mag-bottom">
      <div class="add-search flex-between">
        <el-button @click="showForm" type="primary" size="small" plain
          >添加学生</el-button
        >
        <div>
          <span>按班级过滤：</span>
          <el-select
            :disabled="!classes.length"
            v-model="classID"
            placeholder="请选择班级"
          >
            <el-option label="全部" value="-1" />
            <el-option v-if="classes.length > 0" label="未分班" value="0" />
            <el-option
              :v-if="classes.length > 0"
              v-for="i in classes"
              :label="i.name"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </div>
      </div>
    </el-card>
    <!-- 用户信息展示表格 -->
    <el-card ref="stuShowTable" class="stu-content">
      <el-table
        :max-height="tableHeight"
        :data="students"
        stripe
        row-key="id"
        style="width: 100%"
      >
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学号/账号" prop="account"></el-table-column>
        <el-table-column label="所在班级">
          <template v-slot="{ row }">
            <span>{{ row.cname || "暂未分班" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-popconfirm title="确定删除吗？" @confirm="delStudent(row.id)">
              <el-link class="mag" type="danger" slot="reference"
                >删除学生账号</el-link
              >
            </el-popconfirm>
            <DropDown
              title="修改所属班级"
              :selection="classes.filter((it) => it.id != row.classID)"
              :infoID="row.id"
              icon="el-icon-s-home"
              @choose="alterStudent"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户表单弹窗 -->
    <AccountDialog
      :dialogFormVisible="showed"
      :options="classes"
      :aType="1"
      @onSubmit="addStudent"
      @closeDialog="closeForm"
    />
  </div>
</template>

<script>
import api from "@/api"
import DropDown from "@/components/DropDown.vue"
import AccountDialog from "@/components/AccountDialog.vue"
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: "Students",
  components: {
    AccountDialog,
    DropDown
  },
  created() {
    this.getData()
    if (!this.$store.state.classes.length) {
      this.$store.dispatch("getClasses")
    }
    // 订阅 reGetStudent 消息
    this.$bus.$on('reGetStudent', () => this.classID = '-1')
  },
  data() {
    return {
      showed: false,
      classID: '-1',
      tableHeight: 250
    }
  },
  mounted() {
    let elObserver = elementResizeDetectorMaker({ strategy: "scroll" })
    elObserver.listenTo(this.$refs.stuShowTable.$el, (() => {
      let __lastHeight
      return (el) => {
        if (__lastHeight === el.offsetHeight) return
        this.tableHeight = el.offsetHeight - 40
        __lastHeight = el.offsetHeight
      }
    })())
  },
  methods: {
    getData() {
      let data = {}
      if (this.classID != '-1') data = { classID: this.classID }
      this.$store.dispatch('getStudents', data)
    },
    showForm() {
      // this.$bus.$emit('changeView', true)
      this.showed = true
    },
    closeForm() {
      this.showed = false
    },
    async addStudent(form) {
      console.log(form)
      const res = await api.addStudent(form).catch(() => { })
      if (res.code == 200) {
        this.$message.success('添加成功')
        this.getData()
        this.showed = false
      } else {
        console.log(res)
        this.$message.error(res.message)
      }
    },

    async delStudent(id) {
      const res = await api.deleteStudent({ id }).catch(() => { })
      if (res.code == 200) {
        this.$message.success("删除成功")
        this.getData()
      } else {
        console.log(res);
        this.$message.error(res.message)
      }
    },
    async alterStudent(options) {
      let data = { id: options.infoID, classID: options.chooseID }
      const res = await api.alertStudent(data).catch(() => { })
      if (res.code == 200) {
        this.$message.success("修改成功")
        this.getData()
      } else {
        console.log(res)
        this.$message.error(res.message)
      }
    }
  },
  computed: {
    classes: function () {
      return this.$store.state.classes
    },
    students: function () {
      return this.$store.state.students
    }
  },
  watch: {
    classID: function () {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.mag {
  margin-right: 10px;
}
.students {
  height: 100%;

  .stu-content {
    height: calc(100% - 92px);
  }
}
</style>