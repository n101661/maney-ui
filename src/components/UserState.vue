<script setup lang="ts">
import { Avatar } from "@element-plus/icons-vue"
import { useAuthStore } from "../stores/auth"

const emit = defineEmits<{
  (e: "showDialog"): void
}>()

const auth = useAuthStore()

function showDialog(): void {
  emit("showDialog")
}

function logout(): void {
  ElMessageBox.confirm("Do you want to log out?", "", {
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    type: "info",
  })
    .then(() => {
      auth.logout()
    })
    .catch(() => {})
}
</script>

<template>
  <div style="align-self: center">
    <div v-if="auth.userId === ''" class="user-state">
      <ElLink :underline="false">Register Account?</ElLink>
      <ElButton :icon="Avatar" circle size="large" @click="showDialog" />
    </div>
    <div v-else class="user-state">
      <ElDropdown placement="bottom" trigger="click">
        <ElButton circle size="large">{{ auth.userId.charAt(0) }}</ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="logout">Logout</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<style scoped>
.user-state {
  display: flex;
  gap: 20px;
}
</style>
