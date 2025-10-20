/*
 * <license header>
 */

import type { SuccessResponse } from '@adobe-commerce/aio-toolkit'
import { EXTENSION_ID } from '@actions/constants'
import { main as registrationAction } from '../../../actions/admin-ui-sdk/registration/index'

// Type for OpenWhisk action parameters
type ActionParams = Record<string, unknown>

jest.mock('@adobe-commerce/aio-toolkit', () => {
  const actual = jest.requireActual('@adobe-commerce/aio-toolkit')
  return {
    ...actual,
    AdminUiSdk: jest.fn().mockImplementation((extensionId: string) => ({
      addMenuItem: jest.fn(),
      addMenuSection: jest.fn(),
      addPage: jest.fn(),
      getRegistration: jest.fn().mockResolvedValue({
        menuItems: [
          {
            id: `${extensionId}::app_builder_extension`,
            title: 'App Builder Extension',
            parent: `${extensionId}::apps`,
            sortOrder: 100
          },
          {
            id: `${extensionId}::apps`,
            title: 'Apps',
            isSection: true,
            sortOrder: 100
          }
        ],
        page: {
          title: 'App Builder Extension'
        }
      })
    }))
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('registration action', () => {
  describe('successful scenarios', () => {
    it('should return registration configuration with menu items and page', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'get'
      }

      const response = (await registrationAction(params)) as SuccessResponse
      const body = response.body as Record<string, unknown>
      const registration = body.registration as Record<string, unknown>

      expect(response.statusCode).toBe(200)
      expect(registration).toHaveProperty('menuItems')
      expect(registration).toHaveProperty('page')
    })

    it('should return correct menu items structure', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'get'
      }

      const response = (await registrationAction(params)) as SuccessResponse
      const body = response.body as Record<string, unknown>
      const registration = body.registration as Record<string, unknown>

      expect(registration.menuItems).toEqual([
        {
          id: `${EXTENSION_ID}::first`,
          title: 'Adobe Commerce First App on App Builder',
          parent: `${EXTENSION_ID}::apps`,
          sortOrder: 1
        },
        {
          id: `${EXTENSION_ID}::apps`,
          title: 'Apps',
          isSection: true,
          sortOrder: 100
        }
      ])
    })

    it('should return correct page configuration', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'get'
      }

      const response = (await registrationAction(params)) as SuccessResponse
      const body = response.body as Record<string, unknown>
      const registration = body.registration as Record<string, unknown>

      expect(registration.page).toEqual({
        title: 'Adobe Commerce First App on App Builder'
      })
    })

    it('should work without any parameters', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'post'
      }

      const response = (await registrationAction(params)) as SuccessResponse
      const body = response.body as Record<string, unknown>
      const registration = body.registration as Record<string, unknown>

      expect(response.statusCode).toBe(200)
      expect(registration.menuItems).toBeDefined()
      expect(registration.page).toBeDefined()
    })
  })

  describe('extension ID usage', () => {
    it('should use EXTENSION_ID constant in menu item IDs', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'get'
      }

      const response = (await registrationAction(params)) as SuccessResponse
      const body = response.body as Record<string, unknown>
      const registration = body.registration as Record<string, unknown>
      const menuItems = registration.menuItems as Array<{ id: string; parent?: string }>

      expect(menuItems[0].id).toContain(EXTENSION_ID)
      expect(menuItems[0].parent).toContain(EXTENSION_ID)
      expect(menuItems[1].id).toContain(EXTENSION_ID)
    })
  })

  describe('HTTP method validation', () => {
    it('should return 405 for unsupported HTTP method', async () => {
      const params: ActionParams = {
        __ow_headers: {},
        __ow_method: 'delete'
      }

      const response = await registrationAction(params)

      expect(response).toHaveProperty('error')
      const errorResponse = response as { error: { statusCode: number; body: { error: string } } }
      expect(errorResponse.error.statusCode).toBe(405)
      expect(errorResponse.error.body.error).toContain('Invalid HTTP method')
    })
  })
})
