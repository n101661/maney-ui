import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: "",
    accessToken: "",
  }),
  actions: {
    refresh(accessToken: string): void {
      this.accessToken = accessToken
    },
    login(userId: string, accessToken: string): void {
      this.userId = userId
      this.accessToken = accessToken
    },
    logout(): void {
      this.userId = ""
      this.accessToken = ""
    },
  },
})
