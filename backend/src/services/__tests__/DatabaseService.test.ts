import { describe, it, expect } from 'vitest'
import { DatabaseService } from '../../services/DatabaseService'

describe('DatabaseService', () => {
  it('should throw error when getting instance before initialization', () => {
    expect(() => DatabaseService.getInstance()).toThrow(
      'Base de données non initialisée. Appelez DatabaseService.initialize() d\'abord.'
    )
  })

  // Note: Les autres tests nécessitent une vraie base de données ou des mocks plus complexes
  // Ils pourraient être déplacés dans des tests d'intégration
})
