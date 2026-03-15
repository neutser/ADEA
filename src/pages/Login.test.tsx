import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { AuthProvider } from '../contexts/AuthContext'

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('Login', () => {
  it('renders login form', () => {
    renderLogin()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('has email and password inputs', () => {
    renderLogin()
    expect(screen.getByPlaceholderText(/you@company.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
  })

  it('has sign up link', () => {
    renderLogin()
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument()
  })
})
