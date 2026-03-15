import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from './CartContext'

function TestConsumer() {
  const { items, addItem, removeItem, itemCount } = useCart()
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <button onClick={() => addItem({ name: 'Test', price: 10 })}>Add</button>
      {items.map((i) => (
        <div key={i.id}>
          {i.name} - <button onClick={() => removeItem(i.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    )
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('adds item to cart', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    )
    await act(async () => {
      await user.click(screen.getByText('Add'))
    })
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByText(/Test/)).toBeInTheDocument()
  })

  it('removes item from cart', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    )
    await act(async () => {
      await user.click(screen.getByText('Add'))
    })
    await act(async () => {
      await user.click(screen.getByText('Remove'))
    })
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
