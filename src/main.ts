import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { createPinia } from "pinia"
import { client } from "./client/services.gen"

setupApiClient()

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.mount("#app")

function setupApiClient(): void {
  client.setConfig({
    baseURL: import.meta.env.VITE_BASE_URL,
  })
}
