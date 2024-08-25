<script setup lang="ts">
import { Avatar } from "@element-plus/icons-vue"
</script>

<template>
  <div class="user-state">
    <el-link :underline="false">Register Account?</el-link>
    <el-button :icon="Avatar" circle size="large" />
  </div>
</template>

<style scoped>
.user-state {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
