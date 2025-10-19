/*
 * <license header>
 */

import type { SuccessResponse, ErrorResponse } from '@adobe-commerce/aio-toolkit'
import { exampleAction } from '../../../actions/example/generic/index'

// Type for OpenWhisk action parameters
type ActionParams = Record<string, unknown>

const mockUserManagerGet = jest.fn()

jest.mock('@lib/user-manager', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    get: mockUserManagerGet
  }))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

const fakeParams: ActionParams = {
  __ow_headers: { authorization: 'Bearer fake_token' },
  __ow_method: 'get'
}

describe('example/generic action', () => {
  describe('main function', () => {
    it('should be defined', () => {
      expect(exampleAction).toBeInstanceOf(Function)
    })

    it('should return success response with default Guest user', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const response = (await exampleAction(fakeParams)) as SuccessResponse
      const body = response.body as Record<string, unknown>

      expect(response.statusCode).toBe(200)
      expect(body.message).toBe('Hello, Guest!')
      expect(response.headers).toEqual({})
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
    })

    it('should return success response with custom name parameter', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'John' })

      const response = (await exampleAction({
        ...fakeParams,
        name: 'John'
      })) as SuccessResponse
      const body = response.body as Record<string, unknown>

      expect(response.statusCode).toBe(200)
      expect(body.message).toBe('Hello, John!')
      expect(response.headers).toEqual({})
      expect(mockUserManagerGet).toHaveBeenCalledWith('John')
    })

    it('should trim name parameter', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Alice' })

      await exampleAction({
        ...fakeParams,
        name: '  Alice  '
      })

      expect(mockUserManagerGet).toHaveBeenCalledWith('Alice')
    })

    it('should return 400 when missing authorization header', async () => {
      const response = (await exampleAction({
        __ow_headers: {},
        __ow_method: 'get'
      })) as ErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: "missing header(s) 'authorization'"
          }
        }
      })
    })

    it('should default to Guest when name parameter is empty string', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const response = (await exampleAction({
        ...fakeParams,
        name: ''
      })) as SuccessResponse

      expect(response.statusCode).toBe(200)
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
    })

    it('should default to Guest when name is whitespace only', async () => {
      mockUserManagerGet.mockReturnValue({ name: 'Guest' })

      const response = (await exampleAction({
        ...fakeParams,
        name: '   '
      })) as SuccessResponse

      expect(response.statusCode).toBe(200)
      expect(mockUserManagerGet).toHaveBeenCalledWith('Guest')
    })

    it('should return 500 when unexpected error occurs', async () => {
      mockUserManagerGet.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const response = (await exampleAction(fakeParams)) as ErrorResponse

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: 'server error'
          }
        }
      })
    })

    it('should handle non-Error exceptions', async () => {
      mockUserManagerGet.mockImplementation(() => {
        // eslint-disable-next-line no-throw-literal
        throw 'String error'
      })

      const response = (await exampleAction(fakeParams)) as ErrorResponse

      expect(response.error.statusCode).toBe(500)
      expect(response.error.body.error).toBe('server error')
    })
  })
})
