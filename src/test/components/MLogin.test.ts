import { beforeAll, afterAll, describe, test, vi, expect } from "vitest"
import { AxiosHeaders, AxiosError } from "axios"
import { mount, VueWrapper, flushPromises } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import { useAuthStore } from "../../stores/auth"

describe("login successful", async () => {
  interface LoginSuccessCase {
    name: string
    act: (wrapper: VueWrapper) => Promise<void>
  }

  const accessToken = "test-accessToken"
  const userId = "test-userId"

  beforeAll(() => {
    vi.doMock("../../client/services.gen", async (importOriginal) => {
      const mod =
        await importOriginal<typeof import("../../client/services.gen")>()
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
  })
  afterAll(() => {
    vi.resetModules()
  })

  const cases: LoginSuccessCase[] = [
    {
      name: "press submit button",
      act: async (wrapper: VueWrapper): Promise<void> => {
        await wrapper.get('[data-test="submitButton"]').trigger("click")
      },
    },
    {
      name: "press enter to submit when focus on username field",
      act: async (wrapper: VueWrapper): Promise<void> => {
        await wrapper.get('[data-test="username"]').trigger("keydown.enter")
      },
    },
    {
      name: "press enter to submit when focus on password field",
      act: async (wrapper: VueWrapper): Promise<void> => {
        await wrapper.get('[data-test="password"]').trigger("keydown.enter")
      },
    },
  ]

  for (const c of cases) {
    test(c.name, async () => {
      const wrapper = await newWrapper()

      await wrapper.get('[data-test="username"]').setValue(userId)
      await wrapper.get('[data-test="password"]').setValue("my-password")
      await c.act(wrapper)

      await flushPromises()

      const successEvent = wrapper.emitted("success")
      expect(successEvent).toBeTruthy()
      expect(successEvent?.length).toBe(1)
      expect(successEvent ? successEvent[0] : []).toEqual([userId, accessToken])

      const authStore = useAuthStore()
      expect(authStore.userId).toEqual(userId)
      expect(authStore.accessToken).toEqual(accessToken)
    })
  }
})

test("login failed", async () => {
  const loginSpy = vi.spyOn(await import("../../client/services.gen"), "login")
  const errorMessageSpy = vi.spyOn(
    (await import("element-plus/es"))["ElMessage"],
    "error",
  )

  vi.doMock("../../client/services.gen", async (importOriginal) => {
    const mod =
      await importOriginal<typeof import("../../client/services.gen")>()
    return {
      ...mod,
      login: loginSpy.mockResolvedValue({
        ...new AxiosError(),
        data: undefined,
        error: {},
      }),
    }
  })

  const wrapper = await newWrapper()

  await wrapper.get('[data-test="username"]').setValue("my-id")
  await wrapper.get('[data-test="password"]').setValue("my-password")
  await wrapper.get('[data-test="submitButton"]').trigger("click")

  await flushPromises()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  expect(loginSpy).toBeCalledTimes(1)

  const successEvent = wrapper.emitted("success")
  expect(successEvent).toBeFalsy()

  expect(errorMessageSpy).toBeCalledTimes(1)
})

async function newWrapper(): Promise<VueWrapper> {
  const pinia = setActivePinia(createPinia())

  const MLogin = (await import("../../components/MLogin.vue"))["default"]
  return mount(MLogin, {
    global: {
      plugins: [pinia],
    },
  })
}
