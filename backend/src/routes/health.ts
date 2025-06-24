import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
  version: string
}

async function healthRoutes(fastify: FastifyInstance) {
  // Route de vérification de santé
  fastify.get('/health', {
    schema: {
      description: 'Vérification de l\'état de santé de l\'API',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
            version: { type: 'string' }
          }
        }
      }
    }
  }, async (): Promise<HealthResponse> => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version ?? '1.0.0'
    }
  })

  // Route de vérification de la base de données
  fastify.get('/health/db', {
    schema: {
      description: 'Vérification de l\'état de la base de données',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            database: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { DatabaseService } = await import('../services/DatabaseService')
      const sequelize = DatabaseService.getInstance()
      await sequelize.authenticate()
      
      return {
        database: 'connected',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      reply.code(503)
      return {
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
}

export default healthRoutes
