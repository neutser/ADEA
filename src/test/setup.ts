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

// jsdom does not implement IntersectionObserver / ResizeObserver, which
// framer-motion (whileInView) and canvas-based previews rely on. Without these
// the ErrorBoundary swallows every page render and tests assert on the fallback.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
  root = null
  rootMargin = ''
  thresholds: number[] = []
}
Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, value: MockObserver })
Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, value: MockObserver })

// jsdom has no canvas backend; the product preview calls getContext('2d') on mount.
if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { writable: true, value: () => null })
}
