<template>
  <div class="welcome">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
.welcome {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/img/login_bg.jpg") no-repeat center/cover;

  .card-box {
    width: 480px;
    color: white;

    background: #bdc3c7; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #2c3e50,
      #bdc3c7
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #2c3e50,
      #bdc3c7
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    ::v-deep .el-form-item__label {
      color: rgb(255, 255, 255);
    }
  }
}
</style>