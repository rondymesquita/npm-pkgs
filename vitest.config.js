import process from 'process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { mainFields: ['types',], },
  test: {
    coverage: {
      enabled: true,
      reportsDirectory: `${process.cwd()}/coverage`,
      provider: 'v8',
      reporter: [
        'text', 'html', 'clover', 'json',
      ],

    },
    outputFile: './fulano.html',
    testTimeout: 2000,
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    browser: { enabled: false, },
    environment: 'node',
    singleThread: true,
  },
})
