import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza sem erro', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Investidor100' })).toBeInTheDocument()
  })
})
