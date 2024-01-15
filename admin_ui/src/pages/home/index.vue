<template>
  <el-container class="home-container">
    <el-aside width="none"><Menu /></el-aside>
    <el-container class="el-main-container">
      <el-header><Header /></el-header>
      <el-main>
        <!-- 二级路由出口 -->
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/ContentHeader.vue"
import Menu from "@/components/Menu.vue"
export default {
  name: "Home",
  components: {
    Menu,
    Header
  },
  created() {
    this.$store.dispatch('getUserInfo')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
  .el-header {
    padding: 0 !important;
  }
}
</style>