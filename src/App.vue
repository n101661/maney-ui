<script setup lang="ts">
import UserState from "./components/UserState.vue"
import MMenu from "./components/MMenu.vue"
import MDraggableList from "./components/MDraggableList.vue"
import MItemDialog from "./components/MItemDialog.vue"
import { addItem, listItems } from "./client/mock"
import { Plus } from "@element-plus/icons-vue"
import { Item } from "./models/item"
import { ref, watchEffect } from "vue"

const dialogVisibility = ref(false)
const currentDate = ref(new Date())
const items = ref<Item[]>([])

watchEffect(async () => {
  await refreshList(currentDate.value)
})

function showDialog(): void {
  dialogVisibility.value = true
}

async function submitForm(item: Item): Promise<void> {
  await addItem(item)
  await refreshList(currentDate.value)

  ElMessage({
    message: "Successful",
    type: "success",
  })
}

async function refreshList(date: Date): Promise<void> {
  items.value = await listItems(date)
}
</script>

<template>
  <el-container style="height: 100vh">
    <el-header height="64px">
      <div class="logo">
        <a href="#">
          <img height="48px" src="./images/logo.svg" alt="Maney Logo" />
        </a>
      </div>
      <user-state />
    </el-header>
    <el-container style="height: calc(100vh - 64px)">
      <el-aside width="200px">
        <el-scrollbar>
          <m-menu></m-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="main-header">
          <el-date-picker
            v-model="currentDate"
            type="date"
            placeholder="yyyy-mm-dd"
          ></el-date-picker>
          <el-button :icon="Plus" @click="showDialog">Add</el-button>
        </div>
        <div class="item-list">
          <el-scrollbar>
            <m-draggable-list v-model="items"></m-draggable-list>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <m-item-dialog v-model="dialogVisibility" @submit="submitForm" />
</template>

<style scoped>
.el-header {
  display: flex;
  align-content: center;
  justify-content: space-between;
  border-width: 0 0 1px 0;
  border-color: rgb(116, 116, 116);
  border-style: solid;
}

.el-main {
  padding: 0 20px;
}

.logo {
  align-self: center;
}

.main-header {
  height: 32px;
  padding: 10px 0;
  display: flex;
  gap: 20px;
}

.item-list {
  height: calc(100vh - 64px - 52px - 20px);
  padding: 10px 0;
}
</style>
