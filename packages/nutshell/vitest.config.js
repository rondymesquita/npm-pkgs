import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 2000,
    globals: true,
    clearMocks: true,
    restoreMocks: true
  },
})
