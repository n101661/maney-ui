import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    deps: {
      optimizer: {
        web: {
          include: ["element-plus"],
        },
      },
    },
    setupFiles: ["setupTests.ts"]
  },
});
