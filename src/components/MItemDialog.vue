<template>
  <ElDialog v-model="modelValue" :width="width" data-test="item-dialog">
    <ElForm
      ref="formInstance"
      :model="item"
      label-width="auto"
      :rules="rules"
      status-icon
    >
      <ElFormItem label="Date" prop="date" data-test="date">
        <ElDatePicker
          v-model="item.date"
          type="date"
          :editable="false"
          :clearable="false"
        />
      </ElFormItem>
      <ElFormItem
        label="Amount"
        prop="amount"
        inputmode="decimal"
        data-test="amount"
      >
        <ElInput v-model.number="item.amount" clearable />
      </ElFormItem>
      <ElFormItem label="Category" prop="categoryId" data-test="category-id">
        <ElSelect
          v-model="item.categoryId"
          :empty-values="[0, null, undefined]"
        >
          <ElOption
            v-for="(val, index) in ['Food', 'Groceries', 'Others']"
            :label="val"
            :value="index + 1"
            :key="index"
            data-test="category-option"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Account" prop="accountId" data-test="account-id">
        <ElSelect v-model="item.accountId" :empty-values="[0, null, undefined]">
          <ElOption
            v-for="(val, index) in ['Cash', 'Bank-A']"
            :label="val"
            :value="index + 1"
            :key="index"
            data-test="account-option"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Name" prop="name" data-test="name">
        <ElInput v-model="item.name" clearable />
      </ElFormItem>
      <ElFormItem label="Description" prop="memo" data-test="memo">
        <ElInput v-model="item.memo" type="textarea" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div style="text-align: center">
        <ElButton
          type="primary"
          @click="handleSave(formInstance)"
          data-test="save-button"
        >
          {{ saveText }}
        </ElButton>
        <ElButton
          type="primary"
          @click="handleSaveAndContinue(formInstance)"
          data-test="save-and-continue-button"
        >
          {{ saveAndContinueText }}
        </ElButton>
        <ElButton
          type="warning"
          @click="handleCancel"
          data-test="cancel-button"
        >
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
      const d = new Date()
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
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
</script>
