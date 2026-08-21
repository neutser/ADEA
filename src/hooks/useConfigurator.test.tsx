import { StrictMode } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConfigurator } from './useConfigurator'
import type { MarketplaceProduct } from '@/services/CustomizationEngine'

const product: MarketplaceProduct = {
  id: 'craft-keychain',
  slug: 'craft-keychain',
  name: 'Keychain',
  category: 'crafts',
  description: '',
  base_price: 20,
  hero_image: '',
  customization_schema: {
    surfaces: [],
    fields: [
      { id: 'text', type: 'text', label: 'Text' },
      { id: 'font', type: 'font-picker', label: 'Font' },
    ],
    preview: { type: 'flat-artwork' },
  },
  pricing_rules: null,
  gallery: [],
  tags: [],
  is_quote_only: 0,
  supports_bulk: 1,
  estimated_days: 3,
}

// The hook debounces a server pricing call; keep it off the network.
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
})

function setup() {
  // StrictMode is what the app itself renders under (see main.tsx) and it
  // double-invokes state updaters — the exact condition that made the previous
  // implementation advance the history cursor twice per edit.
  const hook = renderHook(() => useConfigurator({ product, apiBase: '' }), { wrapper: StrictMode })
  act(() => hook.result.current.initForProduct(product))
  return hook
}

describe('useConfigurator history', () => {
  it('records exactly one version per edit under StrictMode', () => {
    const { result } = setup()
    expect(result.current.history).toHaveLength(1)
    expect(result.current.historyIndex).toBe(0)

    act(() => result.current.updateConfigAndHistory('text', 'A'))
    expect(result.current.history).toHaveLength(2)
    expect(result.current.historyIndex).toBe(1)

    act(() => result.current.updateConfigAndHistory('text', 'AB'))
    expect(result.current.history).toHaveLength(3)
    expect(result.current.historyIndex).toBe(2)
    expect(result.current.config.text).toBe('AB')
  })

  it('steps back one edit per undo, not two', () => {
    const { result } = setup()
    act(() => result.current.updateConfigAndHistory('text', 'A'))
    act(() => result.current.updateConfigAndHistory('text', 'AB'))

    act(() => result.current.undo())
    expect(result.current.config.text).toBe('A')
    expect(result.current.canRedo).toBe(true)

    act(() => result.current.undo())
    expect(result.current.config.text).toBe('')
    expect(result.current.canUndo).toBe(false)
  })

  it('redoes forward again', () => {
    const { result } = setup()
    act(() => result.current.updateConfigAndHistory('text', 'A'))
    act(() => result.current.undo())
    expect(result.current.config.text).toBe('')

    act(() => result.current.redo())
    expect(result.current.config.text).toBe('A')
    expect(result.current.canRedo).toBe(false)
  })

  it('drops the redo branch when editing after an undo', () => {
    const { result } = setup()
    act(() => result.current.updateConfigAndHistory('text', 'A'))
    act(() => result.current.updateConfigAndHistory('text', 'AB'))
    act(() => result.current.undo())
    act(() => result.current.updateConfigAndHistory('text', 'AZ'))

    expect(result.current.config.text).toBe('AZ')
    expect(result.current.canRedo).toBe(false)
    expect(result.current.history.map((h) => h.text)).toEqual(['', 'A', 'AZ'])
  })

  it('jumps to a version and ignores out-of-range indexes', () => {
    const { result } = setup()
    act(() => result.current.updateConfigAndHistory('text', 'A'))
    act(() => result.current.updateConfigAndHistory('text', 'AB'))

    act(() => result.current.goToHistoryIndex(0))
    expect(result.current.config.text).toBe('')

    act(() => result.current.goToHistoryIndex(99))
    expect(result.current.config.text).toBe('')
    expect(result.current.historyIndex).toBe(0)
  })

  it('seeds config from the product schema, including the font default', () => {
    const { result } = setup()
    expect(result.current.config.font).toBe('inter')
    expect(result.current.config.text).toBe('')
  })

  it('setConfig edits the design without creating a version', () => {
    // Used by the AI-builder / hero handoff, which should not spawn undo steps.
    const { result } = setup()
    act(() => result.current.setConfig((prev) => ({ ...prev, text: 'from scene' })))
    expect(result.current.config.text).toBe('from scene')
    expect(result.current.history).toHaveLength(1)
    expect(result.current.canUndo).toBe(false)
  })
})
