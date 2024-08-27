<template>
  <el-menu>
    <el-menu-item>
      <el-icon class="menu-icon-wrapper"><House class="icon" /></el-icon>
      <template #title>
        <span>Home</span>
      </template>
    </el-menu-item>
    <el-menu-item>
      <el-icon class="menu-icon-wrapper"><Coin class="icon" /></el-icon>
      <template #title>
        <span>Accounts</span>
      </template>
    </el-menu-item>
    <el-menu-item>
      <el-icon class="menu-icon-wrapper"><Grid class="icon" /></el-icon>
      <template #title>
        <span>Categories</span>
      </template>
    </el-menu-item>
    <el-menu-item>
      <el-icon class="menu-icon-wrapper"><Histogram class="icon" /></el-icon>
      <template #title>
        <span>Reports</span>
      </template>
    </el-menu-item>
    <el-menu-item>
      <el-icon class="menu-icon-wrapper"><Timer class="icon" /></el-icon>
      <template #title>
        <span>Routines</span>
      </template>
    </el-menu-item>
  </el-menu>
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
