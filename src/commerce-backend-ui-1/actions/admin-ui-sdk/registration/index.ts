/*
 * <license header>
 */

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */

import { Core } from '@adobe/aio-sdk'
import { errorResponse, stringParameters, checkMissingRequestInputs } from '@actions/utils'
import type { ActionParams, ActionResponse, ActionErrorResponse } from '@actions/types'
import { EXTENSION_ID } from '@actions/constants'

// main function that will be executed by Adobe I/O Runtime
async function main(params: ActionParams): Promise<ActionResponse | ActionErrorResponse> {
  // create a Logger
  const logger = Core.Logger('main', { level: (params.LOG_LEVEL as string) || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams: string[] = [
      /* add required params */
    ]
    const requiredHeaders: string[] = []
    const errorMessage: string | null = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    )
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    const response: ActionResponse = {
      statusCode: 200,
      body: {
        registration: {
          menuItems: [
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
          ],
          page: {
            title: 'Adobe Commerce First App on App Builder'
          }
        }
      }
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // Handle unexpected errors as server errors (500)
    logger.error(
      'Unexpected error in registration action:',
      error instanceof Error ? error.message : String(error)
    )
    return errorResponse(500, 'Internal server error', logger)
  }
}

export { main }
