<template>
  <ElMenu>
    <ElMenuItem>
      <ElIcon class="menu-icon-wrapper"><House class="icon" /></ElIcon>
      <template #title>
        <span>Home</span>
      </template>
    </ElMenuItem>
    <ElMenuItem>
      <ElIcon class="menu-icon-wrapper"><Coin class="icon" /></ElIcon>
      <template #title>
        <span>Accounts</span>
      </template>
    </ElMenuItem>
    <ElMenuItem>
      <ElIcon class="menu-icon-wrapper"><Grid class="icon" /></ElIcon>
      <template #title>
        <span>Categories</span>
      </template>
    </ElMenuItem>
    <ElMenuItem>
      <ElIcon class="menu-icon-wrapper"><Histogram class="icon" /></ElIcon>
      <template #title>
        <span>Reports</span>
      </template>
    </ElMenuItem>
    <ElMenuItem>
      <ElIcon class="menu-icon-wrapper"><Timer class="icon" /></ElIcon>
      <template #title>
        <span>Routines</span>
      </template>
    </ElMenuItem>
  </ElMenu>
</template>

<script setup lang="ts">
import { House, Coin, Grid, Histogram, Timer } from "@element-plus/icons-vue"
</script>

<style scoped>
.el-menu-item {
  font-size: 18px;
}

.menu-icon-wrapper {
  width: 24px;
  height: 48px;
}

.icon {
  width: inherit;
  height: inherit;
}
</style>
