import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildApp } from '../../server'

describe('Health Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health'
    })

    expect(response.statusCode).toBe(200)
    
    const data = JSON.parse(response.payload)
    expect(data).toHaveProperty('status', 'OK')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('version')
  })

  it('should return database health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health/db'
    })

    // Le status peut être 200 ou 503 selon si la DB est connectée
    expect([200, 503]).toContain(response.statusCode)
    
    const data = JSON.parse(response.payload)
    expect(data).toHaveProperty('database')
    expect(data).toHaveProperty('timestamp')
  })
})
