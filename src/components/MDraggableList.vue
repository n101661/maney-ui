<template>
  <draggableComponent
    tag="table"
    style="width: 100%; border-spacing: 0"
    v-model="items"
    handle=".drag-handler"
    :animation="props.animation"
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
            <ElIcon class="drag-handler icon-wrapper">
              <DCaret class="icon" />
            </ElIcon>
            <ElIcon class="icon-wrapper">
              <Picture class="icon" />
            </ElIcon>
          </div>
        </td>
        <td class="cell">
          <div>{{ element.name }}</div>
          <div style="color: gray">{{ element.description }}</div>
        </td>
        <td class="cell">$ {{ element.amount }}</td>
      </tr>
    </template>
  </draggableComponent>
</template>

<script setup lang="ts">
import { Item } from "../models/item"
import { DCaret, Picture } from "@element-plus/icons-vue"
import draggableComponent from "vuedraggable"

const items = defineModel<Item[]>({
  required: true,
})
const props = defineProps({
  animation: {
    type: Number,
    default: 300,
  },
})
</script>

<style scoped>
.icon-wrapper {
  width: 18px;
  height: 48px;
}

.icon {
  width: inherit;
  height: inherit;
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
</style>
