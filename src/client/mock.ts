import { Item } from "../models/item"

const userBucket = new Map<string, string>([["tester", "123456"]])
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
      memo: "this is apple item.",
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
      memo: "this is banana item.",
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
      memo: "this is chocolate item.",
    },
  ],
])
// Key is date, value is item ids.
const dateBucket = new Map<number, number[]>([
  [clipDate(new Date()).getTime(), [0, 1, 2]],
])

let validAccessToken = ""
let validRefreshToken = ""

function generateAuth(): void {
  validAccessToken = new Date().toString()
  validRefreshToken = new Date().toString() + Math.random().toString()
}

export async function login(
  user: string,
  password: string,
): Promise<AuthResponse> {
  await sleep(1000)

  if (userBucket.has(user) && (userBucket.get(user) as string) === password) {
    generateAuth()

    return {
      accessToken: validAccessToken,
      refreshToken: validRefreshToken,
    }
  }
  throw new Error("Invalid username or password")
}

export async function authRefresh(token: string): Promise<AuthResponse> {
  await sleep(20)

  if (token === validRefreshToken) {
    generateAuth()

    return {
      accessToken: validAccessToken,
      refreshToken: validRefreshToken,
    }
  }
  throw new Error("Invalid refresh token")
}

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

interface AuthResponse {
  accessToken: string
  refreshToken: string
}
