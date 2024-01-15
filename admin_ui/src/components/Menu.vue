<template>
  <el-menu
    :default-active="MenuIndex"
    background-color="#343a40"
    text-color="#fff"
    active-text-color="#ffd04b"
    class="menu"
    :collapse="folded"
    @select="MSelect"
  >
    <h3 :class="folded ? '' : 'open'">
      {{ folded ? "后台" : "校园门禁后台管理" }}
    </h3>
    <el-menu-item index="0">
      <i class="el-icon-s-management"></i>
      <span slot="title">班级信息</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="el-icon-user-solid"></i>
      <span slot="title">学生信息</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-s-custom"></i>
      <span slot="title">教师信息</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-setting"></i>
      <span slot="title">个人信息</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      folded: false,
      MenuIndex: '0',
      MenuList: ['classes', 'students', 'teachers', 'myinfo']
    }
  },
  beforeMount() {
    this.$bus.$on('changeFold', () => this.folded = !this.folded)
  },
  methods: {
    MSelect(i) {
      this.$router.replace({ name: this.MenuList[i] })
    }
  },
  watch: {
    // 监听路由变化，切换选中项
    '$route.name': {
      handler: function () {
        this.MenuIndex = (this.MenuList.indexOf(this.$route.name)).toString()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less">
.menu {
  height: 100%;
  border: none !important;

  h3 {
    height: 60px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-bottom: 1px dashed #6bb2c2;
    box-sizing: border-box;
  }
  h3.open {
    width: 224px;
  }
}
.menu:not(.el-menu--collapse) {
  width: 224px;
  min-height: 400px;
}
</style>