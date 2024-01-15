<template>
  <div class="content-header">
    <div class="l">
      <button
        class="size-button"
        :class="fold ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="onChangeFold"
      ></button>
    </div>
    <div class="r">
      <el-avatar :src="userInfo.pic || defaultAvatar"></el-avatar>

      <span class="user">{{ userInfo.name }}</span>
      <el-tooltip
        class="item"
        effect="light"
        content="退出登录"
        placement="bottom"
      >
        <el-button
          class="el-icon-switch-button"
          size="mini"
          type="danger"
          circle
          plain
          @click="logOut"
        ></el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import defaultAvatar from '@/assets/avatar.png'
export default {
  name: "ContentHeader",
  data() {
    return {
      fold: false,
      defaultAvatar
    }
  },
  methods: {
    logOut() {
      this.$store.commit("CHANGETOKEN", null)
      localStorage.removeItem('token')
      this.$router.replace({ name: 'login' })
      this.$message({ type: 'info', message: '欢迎下次再来!' })
    },
    onChangeFold() {
      this.fold = !this.fold
      this.$bus.$emit("changeFold")
    }
  },
  computed: {
    userInfo: function () {
      return this.$store.state.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
.content-header {
  height: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3e444a;
  .l {
    color: rgb(228, 227, 227);
    .size-button {
      font-weight: bold;
      height: 28px;
    }
  }
  .r {
    display: flex;
    align-items: center;
    gap: 20px;
    color: white;
  }
}
</style>