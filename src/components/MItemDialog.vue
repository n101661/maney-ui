<template>
  <ElDialog v-model="modelValue" :width="width">
    <ElForm
      ref="formInstance"
      :model="item"
      label-width="auto"
      :rules="rules"
      status-icon
    >
      <ElFormItem label="Date" prop="date">
        <ElDatePicker
          v-model="item.date"
          type="date"
          :editable="false"
          :clearable="false"
        />
      </ElFormItem>
      <ElFormItem label="Amount" prop="amount" inputmode="decimal">
        <ElInput v-model="item.amount" clearable @change="maybeParseFloat" />
      </ElFormItem>
      <ElFormItem label="Category" prop="categoryId">
        <ElSelect
          v-model="item.categoryId"
          :empty-values="[0, null, undefined]"
        >
          <ElOption
            v-for="(val, index) in ['Food', 'Groceries', 'Others']"
            :label="val"
            :value="index + 1"
            :key="index"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Account" prop="accountId">
        <ElSelect v-model="item.accountId" :empty-values="[0, null, undefined]">
          <ElOption
            v-for="(val, index) in ['Cash', 'Bank-A']"
            :label="val"
            :value="index + 1"
            :key="index"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Name" prop="name">
        <ElInput v-model="item.name" clearable />
      </ElFormItem>
      <ElFormItem label="Description" prop="memo">
        <ElInput v-model="item.memo" type="textarea" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div style="text-align: center">
        <ElButton type="primary" @click="handleSave(formInstance)">
          {{ saveText }}
        </ElButton>
        <ElButton type="primary" @click="handleSaveAndContinue(formInstance)">
          {{ saveAndContinueText }}
        </ElButton>
        <ElButton type="warning" @click="handleCancel">
          {{ cancelText }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus"
import { Item } from "../models/item"
import { ref, watchEffect } from "vue"

const modelValue = defineModel<boolean>({
  required: true,
})
const props = defineProps({
  width: {
    type: [String, Number],
    default: "50%",
  },
  date: {
    type: Date,
    default() {
      return new Date()
    },
  },
  saveText: {
    type: String,
    default: "Save",
  },
  saveAndContinueText: {
    type: String,
    default: "Save and Continue",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
})
const emit = defineEmits<{
  (e: "submit", data: Item): Promise<void>
}>()

const item = ref<Item>({
  id: 0,
  date: props.date,
  amount: 0,
  categoryId: 0,
  accountId: 0,
  name: "",
  memo: "",
})
const formInstance = ref<FormInstance>()
watchEffect(() => {
  item.value.date = props.date
})

const rules: FormRules<Item> = {
  date: {
    type: "date",
    required: true,
    message: "Please select a date",
    trigger: "change",
  },
  amount: {
    type: "number",
    required: true,
    message: "Please enter a positive amount",
    trigger: "change",
    validator: function (_rule, value): boolean {
      return isPositiveNumber(value)
    },
  },
  categoryId: {
    type: "number",
    required: true,
    message: "Please select a category",
    trigger: "change",
    validator: function (_rule, value): boolean {
      return isPositiveNumber(value)
    },
  },
  accountId: {
    type: "number",
    required: true,
    message: "Please select an account",
    trigger: "change",
    validator: function (_rule, value): boolean {
      return isPositiveNumber(value)
    },
  },
}

function handleSave(f: FormInstance | undefined): void {
  if (f) {
    f.validate(async (valid) => {
      if (valid) {
        await emit("submit", { ...item.value })
        modelValue.value = false
        resetForm(f)
      }
    })
  }
}

function handleSaveAndContinue(f: FormInstance | undefined): void {
  if (f) {
    f.validate(async (valid) => {
      if (valid) {
        await emit("submit", { ...item.value })
        resetForm(f)
      }
    })
  }
}

function handleCancel(): void {
  modelValue.value = false
}

function resetForm(f: FormInstance | undefined): void {
  if (f) {
    f.resetFields(["amount", "categoryId", "accountId", "name", "memo"])
  }
}

function isPositiveNumber(s: string): boolean {
  const d = Number(s)
  return isNaN(d) ? false : d > 0
}

function maybeParseFloat(value: string): void {
  const d = Number(value)
  if (!isNaN(d)) {
    item.value.amount = d
  }
}
</script>
