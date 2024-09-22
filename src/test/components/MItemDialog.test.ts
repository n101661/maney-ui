import { test, expect, describe } from "vitest"
import { DOMWrapper, VueWrapper, flushPromises, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"

test("not set date prop", async () => {
  const wrapper = await newWrapper({})

  const dateInput = wrapper
    .get('[data-test="date"]')
    .element.querySelector("input")
  expect(dateInput?.value).toBe(formatDate(new Date()))
})

test("set 2001-02-03 as date prop", async () => {
  const date = new Date(2001, 2, 3)
  const wrapper = await newWrapper({ date: date })

  const dateInput = wrapper
    .get('[data-test="date"]')
    .element.querySelector("input")
  expect(dateInput?.value).toBe(formatDate(date))
})

describe("fill out the form and submit the form", async () => {
  interface SubmitCase {
    name: string
    submitAction: (wrapper: VueWrapper) => Promise<void>
  }

  const cases: SubmitCase[] = [
    {
      name: "press save button",
      submitAction: async (wrapper: VueWrapper) => {
        const saveButton = wrapper.get('[data-test="save-button"]')
        await saveButton.trigger("click")
      },
    },
    {
      name: "press save&continue button",
      submitAction: async (wrapper: VueWrapper) => {
        const saveButton = wrapper.get('[data-test="save-and-continue-button"]')
        await saveButton.trigger("click")
      },
    },
  ]

  for (let c of cases) {
    test(c.name, async () => {
      document.body.innerHTML = ""

      const wrapper = await newWrapper({})
      const bodyWrapper = new DOMWrapper(document.body)

      const amountInput = wrapper
        .get('[data-test="amount"]')
        .findComponent({ name: "ElInput" })
      await amountInput.setValue("10")

      const categoryOptions = bodyWrapper.findAll(
        '[data-test="category-option"]',
      )
      const selectedCategoryOption = Math.floor(
        Math.random() * categoryOptions.length,
      )
      await categoryOptions[selectedCategoryOption].trigger("click")

      const accountOptions = bodyWrapper.findAll('[data-test="account-option"]')
      const selectedAccountOption = Math.floor(
        Math.random() * accountOptions.length,
      )
      await accountOptions[selectedAccountOption].trigger("click")

      const nameInput = wrapper
        .get('[data-test="name"]')
        .findComponent({ name: "ElInput" })
      await nameInput.setValue("apple")
      expect(nameInput.exists()).toBe(true)

      const memoInput = wrapper
        .get('[data-test="memo"]')
        .findComponent({ name: "ElInput" })
      await memoInput.setValue("this is an apple")

      await c.submitAction(wrapper)
      await flushPromises()

      const submitEvent = wrapper.emitted("submit")
      expect(submitEvent?.length).toBe(1)
      expect(submitEvent?.[0]).toEqual([
        {
          id: 0,
          date: truncateToDate(new Date()),
          amount: 10,
          categoryId: selectedCategoryOption + 1,
          accountId: selectedAccountOption + 1,
          name: "apple",
          memo: "this is an apple",
        },
      ])
    })
  }
})

async function newWrapper(props: Props): Promise<VueWrapper> {
  const pinia = setActivePinia(createPinia())

  const component = (await import("../../components/MItemDialog.vue"))[
    "default"
  ]
  return mount(component, {
    global: {
      plugins: [pinia],
    },
    props: {
      modelValue: true,
      date: props.date,
    },
  })
}

interface Props {
  date?: Date
}

function formatDate(d: Date): string {
  let month = (d.getMonth() + 1).toString()
  if (month.length === 1) month = "0" + month

  let date = d.getDate().toString()
  if (date.length === 1) date = "0" + date

  return `${d.getFullYear()}-${month}-${date}`
}

function truncateToDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
