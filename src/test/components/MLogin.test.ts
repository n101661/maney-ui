import { afterEach, describe, test, vi, expect } from "vitest"
import { AxiosHeaders } from "axios"
import { mount } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import ElementPlus, { ElMessage } from "element-plus"
import { useAuthStore } from "../../stores/auth"
import { promiseDone } from "../utils"

afterEach(() => {
  vi.resetModules()
})

describe("login successful", () => {
  test("press submit button", async () => {
    const accessToken = "test-accessToken"
    const userId = "test-userId"

    vi.doMock(import("../../client/services.gen"), async (importOriginal) => {
      const mod = await importOriginal()
      return {
        ...mod,
        login: vi.fn(mod.login).mockResolvedValue({
          data: {
            accessToken: accessToken,
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

    const pinia = setActivePinia(createPinia())

    const MLogin = (await import("../../components/MLogin.vue"))["default"]
    const wrapper = mount(MLogin, {
      global: {
        plugins: [ElementPlus, pinia],
        components: {
          ElMessage: ElMessage,
        },
      },
    })

    await wrapper.get('[data-test="username"]').setValue(userId)
    await wrapper.get('[data-test="password"]').setValue("my-password")
    await wrapper.get('[data-test="submitButton"]').trigger("click")

    await wrapper.vm.$nextTick()
    await promiseDone()

    const successEvent = wrapper.emitted("success")
    expect(successEvent).toBeTruthy()
    expect(successEvent?.length).toBe(1)
    expect(successEvent ? successEvent[0] : []).toEqual([userId, accessToken])

    const authStore = useAuthStore()
    expect(authStore.userId).toEqual(userId)
    expect(authStore.accessToken).toEqual(accessToken)
  })
})
