import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: "",
    accessToken: "",
    refreshToken: "",
  }),
  actions: {
    refresh(accessToken: string, refreshToken: string): void {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    login(userId: string, accessToken: string, refreshToken: string): void {
      this.userId = userId
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    logout(): void {
      this.userId = ""
      this.accessToken = ""
      this.refreshToken = ""
    },
  },
})
