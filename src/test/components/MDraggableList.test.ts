import { VueWrapper, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { test, expect } from "vitest"
import { Item } from "../../models/item"

test("list items", async () => {
  const items: Item[] = [
    {
      id: 0,
      date: new Date(2000, 1, 1),
      amount: 1,
      categoryId: 2,
      accountId: 3,
      name: "name-0",
      memo: "memo-0",
    },
    {
      id: 1,
      date: new Date(2000, 1, 2),
      amount: 11,
      categoryId: 12,
      accountId: 13,
      name: "name-1",
      memo: "memo-1",
    },
  ]

  const wrapper = await newWrapper({
    modelValue: items,
  })

  const rows = wrapper.findAll('[data-test="item"]')
  expect(rows.length).toBe(2)
  for (let i = 0; i < rows.length; i++) {
    expect(rows[i].text()).toBe(
      `${items[i].name}${items[i].memo}$ ${items[i].amount}`,
    )
  }
})

test("no item", async () => {
  const wrapper = await newWrapper({ modelValue: [] })

  const rows = wrapper.findAll('[data-test="item"]')
  expect(rows.length).toBe(0)
})

async function newWrapper(props: Props): Promise<VueWrapper> {
  const pinia = setActivePinia(createPinia())

  const component = (await import("../../components/MDraggableList.vue"))[
    "default"
  ]
  return mount(component, {
    global: {
      plugins: [pinia],
    },
    props: props,
  })
}

interface Props {
  modelValue: Array<Item>
}
