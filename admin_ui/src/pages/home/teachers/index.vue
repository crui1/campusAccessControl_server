<template>
  <div class="teachers">
    <!-- 头部操作栏 -->
    <el-card class="tc-head mag-bottom">
      <div class="add-search flex-between">
        <el-button @click="showForm" type="primary" size="small" plain
          >添加教师</el-button
        >
        <el-input
          placeholder="请输入教师名字关键词"
          prefix-icon="el-icon-search"
          :clearable="true"
          v-model.trim="keyword"
          style="width: 260px"
        >
        </el-input>
      </div>
    </el-card>
    <!-- 用户信息展示表格 -->
    <el-card ref="tcContent" class="tc-content">
      <el-table
        :data="teachers"
        :max-height="tableHeight"
        stripe
        row-key="id"
        style="width: 100%"
      >
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="工号/账号" prop="account"></el-table-column>
        <el-table-column label="管理/所属班级" prop="cname">
          <template v-slot="{ row }">
            <span>{{ row.cname || "暂无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delTeacher(row.id, row.account)"
            >
              <el-link type="danger" slot="reference">删除教师账号</el-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户表单弹窗 -->
    <AccountDialog
      :dialogFormVisible="showed"
      :options="classes"
      :aType="0"
      @closeDialog="closeForm"
      @onSubmit="addTeacher"
    />
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
import api from '@/api'
import AccountDialog from "@/components/AccountDialog.vue"
export default {
  name: "Teachers",
  components: {
    AccountDialog
  },
  data() {
    return {
      showed: false,
      keyword: '',
      tableHeight: 250
    }
  },
  created() {
    if (!this.$store.state.teachers.length) {
      this.getData()
    }
  },
  mounted() {
    let elObserver = elementResizeDetectorMaker({ strategy: "scroll" })
    elObserver.listenTo(this.$refs.tcContent.$el, (() => {
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
      this.$store.dispatch('getTeachers')
      this.$store.dispatch('getClasses')
    },
    showForm() {
      this.showed = true
    },
    closeForm() {
      this.showed = false
    },
    async addTeacher(form) {
      console.log(form)
      const res = await api.addTeacher(form).catch(() => { })
      if (res.code == 200) {
        this.$message.success('添加成功')
        this.getData()
        this.showed = false
      } else {
        console.log(res)
        this.$message.error(res.message)
      }
    },
    async delTeacher(id, account) {
      const res = await api.deleteTeacher({ id, account }).catch(() => { })
      if (res.code == 200) {
        this.$message.success("删除成功")
        // if (classID) this.getData()
        // else this.$store.dispatch('getTeachers')
        this.$store.dispatch('getTeachers')
      } else {
        console.log(res);
        this.$message.error(res.message)
      }
    }
  },
  computed: {
    teachers: function () {
      return this.$store.state.teachers
    },
    classes: function () {
      return this.$store.state.classes.filter(it => !it.tcID)
    }
  },
  watch: {
    keyword: function () {
      if (this.$timer) clearTimeout(this.$timer)
      this.$timer = setTimeout(() => {
        this.$store.dispatch('getTeachers', { keyword: this.keyword })
        this.$timer = null
      }, 800)
    }
  }
}
</script>

<style lang="less" scoped>
.teachers {
  height: 100%;

  .tc-content {
    height: calc(100% - 92px);
  }
}
</style>