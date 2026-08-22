import request from 'supertest'

jest.mock('../src/middleware/authMiddleware', () => {
  return {
    neonAuth: (req: any, res: any, next: any) => {
      req.user = { id: '4f37fb92-0cf4-40a6-95bd-ad90d229bb69' }
      next()
    }
  }
})

jest.mock('../src/db', () => ({
  conn: jest.fn()
}))

import { app } from '../src/index'
import { conn } from '../src/db'

// 1. Tell TypeScript that 'conn' is actually a Jest mock function
const mockConn = conn as unknown as jest.Mock;

describe('Habit route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /user/:id should return the data associated with that user id', async () => {
    const mockHabits = [
      { id: 1, name: 'Drink Water', frequency: 'daily', user_id: '4f37fb92-0cf4-40a6-95bd-ad90d229bb69' }
    ]

    mockConn.mockResolvedValueOnce(mockHabits)

    const response = await request(app).get('/api/habit/user/4f37fb92-0cf4-40a6-95bd-ad90d229bb69')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)

    expect(mockConn).toHaveBeenCalledTimes(1)
  })
})
