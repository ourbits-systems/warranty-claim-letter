import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'claims',
    environment: 'node',
    // Letters use the local calendar date; pin it so snapshots are stable
    env: { TZ: 'UTC' }
  }
})
