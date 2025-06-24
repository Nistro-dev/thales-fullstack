import React from 'react'
import { useHealth } from '../hooks/useHealth'

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const isHealthy = status === 'OK' || status === 'connected'
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      isHealthy 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-1 ${
        isHealthy ? 'bg-green-400' : 'bg-red-400'
      }`} />
      {isHealthy ? 'En ligne' : 'Hors ligne'}
    </div>
  )
}

const ApiStatus: React.FC = () => {
  const { healthStatus, dbStatus, loading, error, refetch } = useHealth()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de l'API</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Statut de l'API</h2>
        <button
          onClick={refetch}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {error ? (
        <div className="text-red-600 mb-4">
          ❌ Erreur: {error}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Serveur API:</span>
            <StatusIndicator status={healthStatus?.status || 'disconnected'} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Base de données:</span>
            <StatusIndicator status={dbStatus?.database || 'disconnected'} />
          </div>

          {healthStatus && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(healthStatus.uptime / 60)}m {Math.floor(healthStatus.uptime % 60)}s
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="text-sm text-gray-500">{healthStatus.version}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ApiStatus
