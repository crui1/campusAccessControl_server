<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" deep>
body,
html {
  padding: 0;
  margin: 0;
}
.table {
  margin-bottom: 0 !important;
}
.mag-bottom {
  margin-bottom: 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.table-placeholder {
  background-color: #f2f2f2;
  text-align: center;
  line-height: 50px;
}

/* 滚动条和滑块 */
::-webkit-scrollbar,
::-webkit-scrollbar-thumb {
  width: 8px;
  height: 8px;
  border-radius: 10px;
}

/* 滑块背景色 */
::-webkit-scrollbar-thumb {
  background: #3e444a;
}
/* 其余相关样式设置一个背景色 */
::-webkit-scrollbar,
::-webkit-scrollbar-corner,
::-webkit-resizer,
::-webkit-scrollbar-track,
::-webkit-scrollbar-track-piece {
  background: #efefef;
}
/* 隐藏滚动条按钮 */
::-webkit-scrollbar-button {
  display: none;
}
</style>
