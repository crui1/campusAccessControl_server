<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
      {{ title }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <div v-if="!selection.length" class="placeholder">无数据</div>
      <el-dropdown-item
        :v-if="selection.length != 0"
        v-for="i in selection"
        :key="i.id"
        :command="i.account || i.id"
        :icon="icon"
      >
        {{ i.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "DropDown",
  props: {
    title: {
      typeof: 'String',
      default: ''
    },
    icon: {
      typeof: 'String',
      default: 'el-icon-s-custom'
    },
    selection: {
      typeof: 'Array',
      default: () => {
        return []
      }
    },
    infoID: {
      typeof: 'String',
      default: ''
    },
    additionalID: {
      typeof: 'String',
      default: null
    }
  },
  methods: {
    handleCommand(command) {
      this.$emit("choose", { infoID: this.infoID, chooseID: command, additionalID: this.additionalID || undefined })
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.placeholder {
  width: 80px;
  text-align: center;
}
</style>