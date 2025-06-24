import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  version: string
}

interface DatabaseStatus {
  database: string
  timestamp: string
}

export const useHealth = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [health, db] = await Promise.all([
        apiService.checkHealth(),
        apiService.checkDatabaseHealth()
      ])
      
      setHealthStatus(health)
      setDbStatus(db)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return {
    healthStatus,
    dbStatus,
    loading,
    error,
    refetch: checkHealth
  }
}
