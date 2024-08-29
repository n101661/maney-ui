<template>
  <el-dialog v-model="modelValue" :width="width">
    <el-form
      ref="formInstance"
      :model="item"
      label-width="auto"
      :rules="rules"
      status-icon
    >
      <el-form-item label="Date" prop="date">
        <el-date-picker
          v-model="item.date"
          type="date"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="Amount" prop="amount" inputmode="decimal">
        <el-input v-model="item.amount" clearable @change="maybeParseFloat" />
      </el-form-item>
      <el-form-item label="Category" prop="categoryId">
        <el-select
          v-model="item.categoryId"
          :empty-values="[0, null, undefined]"
        >
          <el-option
            v-for="(val, index) in ['Food', 'Groceries', 'Others']"
            :label="val"
            :value="index + 1"
            :key="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Account" prop="accountId">
        <el-select
          v-model="item.accountId"
          :empty-values="[0, null, undefined]"
        >
          <el-option
            v-for="(val, index) in ['Cash', 'Bank-A']"
            :label="val"
            :value="index + 1"
            :key="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="item.name" clearable />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="item.description" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="handleSave(formInstance)">
          {{ saveText }}
        </el-button>
        <el-button type="primary" @click="handleSaveAndContinue(formInstance)">
          {{ saveAndContinueText }}
        </el-button>
        <el-button type="warning" @click="handleCancel">
          {{ cancelText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
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
  description: "",
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
      const d = Number(value)
      return isNaN(d) ? false : d > 0
    },
  },
  categoryId: {
    type: "number",
    required: true,
    message: "Please select a category",
    trigger: "change",
    validator: function (_rule, value): boolean {
      const d = Number(value)
      return isNaN(d) ? false : d > 0
    },
  },
  accountId: {
    type: "number",
    required: true,
    message: "Please select an account",
    trigger: "change",
    validator: function (_rule, value): boolean {
      const d = Number(value)
      return isNaN(d) ? false : d > 0
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
    f.resetFields(["amount", "categoryId", "accountId", "name", "description"])
  }
}

function maybeParseFloat(value: string): void {
  const d = Number(value)
  if (!isNaN(d)) {
    item.value.amount = d
  }
}
</script>
