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

import { EXTENSION_ID } from '@actions/constants'
import { RuntimeAction, HttpMethod, RuntimeActionResponse } from '@adobe-commerce/aio-toolkit'  

export const main = RuntimeAction.execute(
  'admin-ui-sdk-registration-action',
  [HttpMethod.GET, HttpMethod.POST],
  [],
  [],
  async () => {
    return RuntimeActionResponse.success({
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
    });
  }
);
