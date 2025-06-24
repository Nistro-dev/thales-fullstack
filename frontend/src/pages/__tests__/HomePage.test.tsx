import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../../pages/HomePage'

// Mock du composant ApiStatus pour éviter les appels API dans les tests
vi.mock('../../components/ApiStatus', () => ({
  default: () => <div data-testid="api-status-mock">API Status Mock</div>
}))

describe('HomePage', () => {
  it('renders welcome message', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Bienvenue sur Thales Project')).toBeInTheDocument()
  })

  it('displays technology stack information', () => {
    render(<HomePage />)
    
    // Frontend technologies
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('• React 19')).toBeInTheDocument()
    expect(screen.getAllByText('• TypeScript')).toHaveLength(2) // Frontend et Backend
    expect(screen.getByText('• Vite')).toBeInTheDocument()
    expect(screen.getByText('• Tailwind CSS')).toBeInTheDocument()

    // Backend technologies
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('• Fastify')).toBeInTheDocument()
    expect(screen.getByText('• Sequelize')).toBeInTheDocument()
    expect(screen.getByText('• MySQL')).toBeInTheDocument()
    expect(screen.getByText('• Swagger')).toBeInTheDocument()

    // Tools
    expect(screen.getByText('Outils')).toBeInTheDocument()
    expect(screen.getByText('• PNPM')).toBeInTheDocument()
    expect(screen.getByText('• ESLint')).toBeInTheDocument()
  })

  it('includes API status component', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('api-status-mock')).toBeInTheDocument()
  })
})
