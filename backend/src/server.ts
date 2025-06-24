import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import { DatabaseService } from './services/DatabaseService'
import healthRoutes from './routes/health'

const fastify = Fastify({
  logger: true
})

async function buildApp() {
  // Enregistrement des plugins
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173'
  })

  await fastify.register(multipart)

  // Configuration Swagger
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Thales API',
        description: 'API pour le projet Thales',
        version: '1.0.0'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })

  // Enregistrement des routes
  await fastify.register(healthRoutes, { prefix: '/api' })

  return fastify
}

async function start() {
  try {
    const app = await buildApp()
    
    // Initialisation de la base de données
    await DatabaseService.initialize()
    
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Serveur démarré sur http://localhost:3000')
    console.log('📚 Documentation Swagger disponible sur http://localhost:3000/documentation')
  } catch (err) {
    console.error('Erreur lors du démarrage du serveur:', err)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

export { buildApp }
