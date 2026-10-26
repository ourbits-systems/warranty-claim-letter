import { describe, expect, test } from 'vitest'
import {
  createClaim,
  createClaimStorage,
  parseStoredClaim,
  STORAGE_KEY
} from '../src/claim.js'

function memoryStorage() {
  const data = new Map()
  return {
    data,
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  }
}

function throwingStorage() {
  throw new Error('SecurityError: storage is blocked')
}

describe('createClaimStorage', () => {
  test('stores, loads and clears a claim under the storage key', () => {
    const storage = memoryStorage()
    const store = createClaimStorage(() => storage)
    const claim = { ...createClaim(), country: 'FR' }

    expect(store.load()).toBeNull()
    store.store(claim)
    expect(JSON.parse(storage.data.get(STORAGE_KEY))).toEqual(claim)
    expect(store.load()).toEqual(claim)
    store.clear()
    expect(store.load()).toBeNull()
  })

  test('uses a custom key', () => {
    const storage = memoryStorage()
    createClaimStorage(() => storage, 'other').store(createClaim())
    expect([...storage.data.keys()]).toEqual(['other'])
  })

  test('never throws when storage is blocked', () => {
    const store = createClaimStorage(throwingStorage)
    expect(store.load()).toBeNull()
    expect(() => store.store(createClaim())).not.toThrow()
    expect(() => store.clear()).not.toThrow()
  })

  test('drops corrupt or newer records', () => {
    const storage = memoryStorage()
    const store = createClaimStorage(() => storage)
    storage.setItem(STORAGE_KEY, '{not json')
    expect(store.load()).toBeNull()
    storage.setItem(STORAGE_KEY, JSON.stringify({ v: 99 }))
    expect(store.load()).toBeNull()
  })
})

describe('parseStoredClaim', () => {
  test('accepts JSON strings and already-parsed objects', () => {
    const claim = createClaim()
    expect(parseStoredClaim(JSON.stringify(claim))).toEqual(claim)
    expect(parseStoredClaim({ country: 'NL' }).country).toBe('NL')
  })

  test('returns null for empty or invalid input', () => {
    expect(parseStoredClaim(undefined)).toBeNull()
    expect(parseStoredClaim('')).toBeNull()
    expect(parseStoredClaim('nope')).toBeNull()
  })
})
