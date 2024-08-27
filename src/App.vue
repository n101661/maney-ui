<script setup lang="ts">
import UserState from "./components/UserState.vue"
import MMenu from "./components/MMenu.vue"
import { Plus, DCaret, Picture } from "@element-plus/icons-vue"
import { Item } from "./models/item"
import draggableComponent from "vuedraggable"
import { ref } from "vue"

const items = ref<Item[]>([
  {
    id: 0,
    date: new Date("2024-08-24"),
    amount: 10,
    category_id: 0,
    account_id: 0,
    name: "apple",
    description: "this is apple item.",
  },
  {
    id: 1,
    date: new Date("2024-08-24"),
    amount: 20,
    category_id: 0,
    account_id: 0,
    name: "banana",
    description: "this is banana item.",
  },
  {
    id: 2,
    date: new Date("2024-08-24"),
    amount: 40,
    category_id: 0,
    account_id: 0,
    name: "chocolate",
    description: "this is chocolate item.",
  },
])
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
          <el-date-picker type="date" placeholder="yyyy-mm-dd"></el-date-picker>
          <el-button :icon="Plus">Add</el-button>
        </div>
        <div class="item-list">
          <el-scrollbar>
            <draggable-component
              tag="table"
              style="width: 100%; border-spacing: 0"
              v-model="items"
              handle=".drag-handler"
              :animation="300"
              item-key="id"
            >
              <template #header>
                <colgroup>
                  <col width="50px" />
                  <col width="calc((100% - 50px) / 2)" />
                  <col />
                </colgroup>
              </template>
              <template #item="{ element }">
                <tr>
                  <td class="cell">
                    <div style="display: flex; align-items: center; gap: 8px">
                      <el-icon class="drag-handler icon-wrapper"
                        ><DCaret class="icon"
                      /></el-icon>
                      <el-icon class="icon-wrapper"
                        ><Picture class="icon"
                      /></el-icon>
                    </div>
                  </td>
                  <td class="cell">
                    <div>{{ element.name }}</div>
                    <div style="color: gray">{{ element.description }}</div>
                  </td>
                  <td class="cell">$ {{ element.amount }}</td>
                </tr>
              </template>
            </draggable-component>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
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

.el-menu-item {
  font-size: 18px;
}

.menu-icon-wrapper {
  width: 24px;
  height: 48px;
}

.icon-wrapper {
  width: 18px;
  height: 48px;
}

.icon {
  width: inherit;
  height: inherit;
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

table tr td {
  border-bottom: 1px solid rgb(221, 221, 221);
}

table tr:hover td {
  background-color: #f5f5f5;
}

.cell {
  padding: 10px 10px;
}

.cell > div {
  padding: 4px 0px;
}

.drag-handler {
  cursor: move;
}

.hover {
  background-color: #f0f0f0;
  transition: background-color 0.3s;
}
</style>
