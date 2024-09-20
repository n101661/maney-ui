import { expect, test } from "vitest"
import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import { useAuthStore } from "../../stores/auth"

test("trigger show dialog", async () => {
  const wrapper = await newWrapper()

  await wrapper.find('[data-test="show-dialog-button"]').trigger("click")

  const showDialogEvent = wrapper.emitted("showDialog")
  expect(showDialogEvent).toBeTruthy()
  expect(showDialogEvent?.length).toBe(1)
})

test("authenticated state and logout", async () => {
  const wrapper = await newWrapper()

  expect(
    (await wrapper.find('[data-test="unauthenticated-container"]')).exists(),
  ).toBe(true)
  expect(
    (await wrapper.find('[data-test="authenticated-container"]')).exists(),
  ).toBe(false)

  // Authenticated state.
  useAuthStore().login("tester", "token")
  await wrapper.vm.$nextTick()

  expect(
    await wrapper.find('[data-test="unauthenticated-container"]').exists(),
  ).toBe(false)
  expect(
    await wrapper.find('[data-test="authenticated-container"]').exists(),
  ).toBe(true)

  const bodyWrapper = new DOMWrapper(document.body)

  // Click logout button.
  await bodyWrapper.find('[data-test="logout-button"]').trigger("click")
  const messageBoxYesButton = bodyWrapper.find(
    ".el-message-box .el-button--primary",
  )
  await messageBoxYesButton.trigger("click")
  await wrapper.vm.$nextTick()

  expect(
    (await wrapper.find('[data-test="unauthenticated-container"]')).exists(),
  ).toBe(true)
  expect(
    (await wrapper.find('[data-test="authenticated-container"]')).exists(),
  ).toBe(false)
})

async function newWrapper(): Promise<VueWrapper> {
  const pinia = setActivePinia(createPinia())

  const component = (await import("../../components/UserState.vue"))["default"]
  return mount(component, {
    global: {
      plugins: [pinia],
    },
  })
}
