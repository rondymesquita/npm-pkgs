import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { mainFields: ['types',], },
  test: {
    testTimeout: 2000,
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    browser: { enabled: false, },
    environment: 'node',
    singleThread: true,
  },
})
