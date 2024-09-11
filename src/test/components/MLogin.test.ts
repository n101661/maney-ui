import { test, vi, expect } from "vitest"
import { AxiosHeaders } from "axios"
import { mount } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import ElementPlus, { ElMessage } from "element-plus"
import MLogin from "../../components/MLogin.vue"
import { useAuthStore } from "../../stores/auth"

vi.mock(import("../../client/services.gen"), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    login: vi.fn(mod.login).mockResolvedValue({
      data: {
        accessToken: "my-access-token",
      },
      status: 200,
      statusText: "",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      error: undefined,
    }),
  }
})

test("login successful", async () => {
  const pinia = setActivePinia(createPinia())

  const wrapper = mount(MLogin, {
    global: {
      plugins: [ElementPlus, pinia],
      components: {
        ElMessage: ElMessage,
      },
    },
  })

  const elInputs = wrapper.findAllComponents({ name: "ElInput" })
  const userId = elInputs[0]
  const password = elInputs[1]

  const submitButton = wrapper.findComponent({ name: "ElButton" })

  await userId.find("input").setValue("my-id")
  await password.find("input").setValue("my-password")
  await submitButton.trigger("click")

  await wrapper.vm.$nextTick()
  await promiseDone()

  const successEvent = wrapper.emitted("success")
  expect(successEvent).toBeTruthy()
  expect(successEvent?.length).toBe(1)
  expect(successEvent ? successEvent[0] : []).toEqual([
    "my-id",
    "my-access-token",
  ])

  const authStore = useAuthStore()
  expect(authStore.userId).toEqual("my-id")
  expect(authStore.accessToken).toEqual("my-access-token")
})

function promiseDone(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve))
}
