import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/setup/globalSetup.ts'],
    // globalSetup: ['./tests/setup/globalSetup.ts'],
    // Automatically clean up after each test to ensure isolation
    clearMocks: true,
    restoreMocks: true,
    // Ensure tests run sequentially to avoid database conflicts
    pool: 'threads',
    maxWorkers: 1,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  plugins: [],
})
