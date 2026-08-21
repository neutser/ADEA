import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAtRoute(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

describe('App', () => {
  it('renders home page at /', () => {
    renderAtRoute('/')
    expect(screen.getByRole('heading', { name: /Create Anything/i })).toBeInTheDocument()
  })

  it('renders shop at /shop', () => {
    renderAtRoute('/shop')
    expect(screen.getByText(/Shop by Category/i)).toBeInTheDocument()
  })

  it('renders cart at /cart', () => {
    renderAtRoute('/cart')
    expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument()
  })

  it('renders login at /login', () => {
    renderAtRoute('/login')
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
  })
})
