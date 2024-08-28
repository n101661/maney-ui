import { Item } from "../models/item"

const itemBucket = new Map<number, Item>([
  [
    0,
    {
      id: 0,
      date: clipDate(new Date()),
      amount: 10,
      categoryId: 1,
      accountId: 1,
      name: "apple",
      description: "this is apple item.",
    },
  ],
  [
    1,
    {
      id: 1,
      date: clipDate(new Date()),
      amount: 20,
      categoryId: 1,
      accountId: 2,
      name: "banana",
      description: "this is banana item.",
    },
  ],
  [
    2,
    {
      id: 2,
      date: clipDate(new Date()),
      amount: 40,
      categoryId: 1,
      accountId: 1,
      name: "chocolate",
      description: "this is chocolate item.",
    },
  ],
])
// Key is date, value is item ids.
const dateBucket = new Map<number, number[]>([
  [clipDate(new Date()).getTime(), [0, 1, 2]],
])

const getNextItemId = (function (): () => number {
  let currentItemId = 100
  return (): number => currentItemId++
})()

export async function listItems(date: Date): Promise<Item[]> {
  await sleep(200) // simulate network delay

  date = clipDate(date)

  const itemIds = dateBucket.get(date.getTime()) ?? []
  return itemIds.map((id: number) => {
    return itemBucket.get(id) as Item
  })
}

export async function addItem(item: Item): Promise<void> {
  await sleep(300) // simulate network delay

  const id = getNextItemId()

  item.date = clipDate(item.date)

  itemBucket.set(id, { ...item, id })

  const dateValue = item.date.getTime()

  const data = dateBucket.get(dateValue) ?? []
  data.push(id)
  dateBucket.set(dateValue, data)
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clipDate(d: Date): Date {
  const _d = new Date(d)
  _d.setHours(0)
  _d.setMinutes(0)
  _d.setSeconds(0)
  _d.setMilliseconds(0)
  return _d
}
