import '@testing-library/jest-dom'

// Mock localStorage for jsdom
const localStorageMock = {
  getItem: (_key: string) => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  length: 0,
  key: () => null,
}
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })
