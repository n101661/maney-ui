<template>
  <ElDialog v-model="modelValue" :width="width" destroy-on-close>
    <MLogin @success="successHandler" />
  </ElDialog>
</template>

<script setup lang="ts">
import MLogin from "./MLogin.vue"

const modelValue = defineModel<boolean>({
  required: true,
})
defineProps({
  width: {
    type: [Number, String],
  },
})

const emit = defineEmits<{
  (e: "success", userId: string, accessToken: string): void
}>()

function successHandler(userId: string, accessToken: string): void {
  emit("success", userId, accessToken)
  modelValue.value = false // Close the dialog.
}
</script>
