import { test, vi, expect } from "vitest"
import { AxiosHeaders } from "axios"
import { mount } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import ElementPlus, { ElMessage } from "element-plus"
import { login } from "../../client"
import MLogin from "../../components/MLogin.vue"

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
  const stubLogin = vi.fn(login)
  stubLogin.mockResolvedValue({
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
  })

  const elInputs = wrapper.findAllComponents({ name: "ElInput" })
  const userId = elInputs[0]
  const password = elInputs[1]
  expect(elInputs).toHaveLength(2)

  const submitButton = wrapper.findComponent({ name: "ElButton" })

  await userId.find("input").setValue("my-id")
  await password.find("input").setValue("my-password")
  await submitButton.trigger("click")

  await wrapper.vm.$nextTick()
})
