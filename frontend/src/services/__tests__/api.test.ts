import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../../services/api'

// Mock fetch globally for tests
const mockFetch = vi.fn()
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true
})

describe('ApiService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should make a health check request', async () => {
    const mockResponse = {
      status: 'OK',
      timestamp: '2023-01-01T00:00:00.000Z',
      uptime: 100,
      version: '1.0.0'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await apiService.checkHealth()

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/health',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )

    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    await expect(apiService.checkHealth()).rejects.toThrow('HTTP error! status: 500')
  })

  it('should make GET requests', async () => {
    const mockData = { id: 1, name: 'Test' }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const result = await apiService.get('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/test',
      expect.objectContaining({
        method: 'GET'
      })
    )

    expect(result).toEqual(mockData)
  })

  it('should make POST requests', async () => {
    const mockData = { id: 1, name: 'Test' }
    const postData = { name: 'Test' }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const result = await apiService.post('/test', postData)

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData)
      })
    )

    expect(result).toEqual(mockData)
  })
})
