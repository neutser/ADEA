import { describe, it, expect } from 'vitest'
import {
  buildDefaults,
  calculatePrice,
  FONT_LIBRARY,
  ICON_SYMBOLS,
  type CustomizationSchema,
} from './CustomizationEngine'

function schemaWith(fields: CustomizationSchema['fields']): CustomizationSchema {
  return { surfaces: [], fields, preview: { type: 'flat-artwork' } }
}

describe('buildDefaults', () => {
  it('defaults a font-picker to the first font in the library', () => {
    // Every seeded product declares `{ id: 'font', type: 'font-picker', label }`
    // with no options and no default. Without a default the <select> showed the
    // first font while config.font stayed undefined, so re-picking that same
    // first font fired no change event and the export carried no font.
    const config = buildDefaults(schemaWith([{ id: 'font', type: 'font-picker', label: 'Font' }]))
    expect(config.font).toBe(FONT_LIBRARY[0].id)
  })

  it('defaults an icon-picker to its first icon, or "none"', () => {
    expect(buildDefaults(schemaWith([{ id: 'icon', type: 'icon-picker', label: 'Symbol' }])).icon).toBe('none')
    expect(
      buildDefaults(schemaWith([{ id: 'icon', type: 'icon-picker', label: 'Symbol', icons: ['star', 'paw'] }])).icon
    ).toBe('star')
  })

  it('still honours explicit defaults and first options', () => {
    const config = buildDefaults(
      schemaWith([
        { id: 'size', type: 'slider', label: 'Size', min: 10, max: 90 },
        { id: 'text', type: 'text', label: 'Text' },
        { id: 'led', type: 'checkbox', label: 'LED' },
        { id: 'material', type: 'select', label: 'Material', options: [{ id: 'oak', label: 'Oak' }, { id: 'ash', label: 'Ash' }] },
        { id: 'finish', type: 'select', label: 'Finish', default: 'matte', options: [{ id: 'gloss', label: 'Gloss' }] },
      ])
    )
    expect(config).toMatchObject({ size: 10, text: '', led: false, material: 'oak', finish: 'matte' })
  })

  it('produces a value for every field a schema declares', () => {
    // A field with no default is a field the configurator renders as selected
    // but never stores — the class of bug this guards against.
    const fields: CustomizationSchema['fields'] = [
      { id: 'text', type: 'text', label: 'Text' },
      { id: 'note', type: 'textarea', label: 'Note' },
      { id: 'qty', type: 'number', label: 'Count', min: 1 },
      { id: 'font', type: 'font-picker', label: 'Font' },
      { id: 'icon', type: 'icon-picker', label: 'Icon' },
      { id: 'led', type: 'checkbox', label: 'LED' },
      { id: 'color', type: 'color-swatch', label: 'Colour', options: [{ id: 'black', label: 'Black' }] },
    ]
    const config = buildDefaults(schemaWith(fields))
    for (const field of fields) {
      expect(config, `field "${field.id}" has no default`).toHaveProperty(field.id)
    }
  })
})

describe('ICON_SYMBOLS', () => {
  it('maps every icon id used as a default to a printable glyph', () => {
    expect(ICON_SYMBOLS.none).toBe('')
    expect(ICON_SYMBOLS.heart).toBe('❤️')
    expect(Object.keys(ICON_SYMBOLS).length).toBeGreaterThan(4)
  })
})

describe('calculatePrice', () => {
  it('adds a checkbox priceAdd only when the box is ticked', () => {
    const schema = schemaWith([{ id: 'led', type: 'checkbox', label: 'LED Backlight', priceAdd: 40 }])
    expect(calculatePrice(schema, null, 100, { led: false }, 1).unitPrice).toBe(100)
    expect(calculatePrice(schema, null, 100, { led: true }, 1).unitPrice).toBe(140)
  })

  it('applies bulk tiers to the line total', () => {
    const schema = schemaWith([])
    const single = calculatePrice(schema, null, 100, {}, 1)
    expect(single).toMatchObject({ unitPrice: 100, lineTotal: 100, discount: 0 })

    const bulk = calculatePrice(schema, null, 100, {}, 10)
    expect(bulk.discount).toBe(10)
    expect(bulk.unitPrice).toBe(90)
    expect(bulk.lineTotal).toBe(900)
  })
})
