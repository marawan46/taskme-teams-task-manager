import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globalSetup: './tests/utils/vitestGlobal.ts',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});