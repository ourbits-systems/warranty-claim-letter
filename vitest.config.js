import { defineConfig } from 'vitest/config'
import { WxtVitest } from 'wxt/testing/vitest-plugin'

// Extension tests run against WXT's in-memory fake browser; the claims
// package keeps its own config and runs as a separate project.
export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    projects: [
      'packages/*',
      {
        extends: true,
        test: {
          name: 'extension',
          include: ['tests/**/*.test.{js,jsx}'],
          setupFiles: ['tests/setup.js'],
          environment: 'node'
        }
      }
    ]
  }
})
