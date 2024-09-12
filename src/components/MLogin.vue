<template>
  <div>
    <div class="logo">
      <img height="48px" src="../images/logo.svg" alt="Maney Logo" />
    </div>
    <div class="main">
      <ElForm ref="formRef" :model="user" :rules="rules">
        <ElFormItem prop="name">
          <ElInput
            data-test="username"
            ref="userRef"
            v-model="user.name"
            placeholder="Username"
            @keydown.enter="nextOrSubmit"
          />
        </ElFormItem>
        <ElFormItem prop="password">
          <ElInput
            data-test="password"
            ref="passwordRef"
            v-model="user.password"
            type="password"
            placeholder="Password"
            @keydown.enter="nextOrSubmit"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton
            data-test="submitButton"
            color="#333"
            style="width: -webkit-fill-available"
            :loading="loading"
            :disabled="loading"
            @click="submit"
          >
            Login
          </ElButton>
        </ElFormItem>
      </ElForm>
      <div style="display: grid; row-gap: 4px">
        <div><ElLink :underline="false">Forgot password?</ElLink></div>
        <div><ElLink :underline="false">Register account</ElLink></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules, InputInstance } from "element-plus"
import { nextTick, onMounted, ref } from "vue"
import { useAuthStore } from "../stores/auth"
import { login as loginAPI } from "../client/services.gen"

const formRef = ref<FormInstance>()
const userRef = ref<InputInstance>()
const passwordRef = ref<InputInstance>()
const user = ref({
  name: "",
  password: "",
})
const loading = ref(false)

const emit = defineEmits<{
  (e: "success", userId: string, accessToken: string): void
}>()

const auth = useAuthStore()

const rules: FormRules = {
  name: {
    type: "string",
    required: true,
    message: "Please enter your username",
    trigger: "change",
  },
  password: {
    type: "string",
    required: true,
    message: "Please enter your password",
    trigger: "change",
  },
}

onMounted(async () => {
  await nextTick()
  if (userRef.value) userRef.value.focus()
})

function nextOrSubmit(): void {
  if (user.value.name === "" && userRef.value) {
    userRef.value.focus()
    return
  }

  if (user.value.password === "" && passwordRef.value) {
    passwordRef.value.focus()
    return
  }

  submit()
}

function submit(): void {
  login(formRef.value)
}

async function login(f: FormInstance | undefined): Promise<void> {
  if (!f) return

  try {
    loading.value = true

    const result = await f.validate(() => {})
    if (!result) return

    const resp = await loginAPI({
      body: {
        id: user.value.name,
        password: user.value.password,
      },
    })

    if (resp.status === 200 && resp.data) {
      auth.login(user.value.name, resp.data.accessToken)

      emit("success", user.value.name, resp.data.accessToken)
    } else {
      ElMessage.error("Internal server error")
    }
  } catch (e) {
    ElMessage.error("Invalid username or password")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.logo {
  height: 96px;
  margin: 6px 0;
  text-align: center;
  align-content: center;
}

.main {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
}
</style>
