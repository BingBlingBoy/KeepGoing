import request from 'supertest'
import { app } from '../src/index'

jest.mock('../src/db')

describe('Habit route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST ')

  it('GET /user/:id should return the data associated with that user id', async () => {
    const response = await request(app).get('/api/habit/user/4f37fb92-0cf4-40a6-95bd-ad90d229bb69')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
