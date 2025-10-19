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

import { UserManager, User } from '@lib/user-manager'
import { HttpMethod, RuntimeAction, RuntimeActionResponse } from '@adobe-commerce/aio-toolkit'

const exampleAction = RuntimeAction.execute(
  'generic-action',
  [HttpMethod.GET, HttpMethod.POST],
  [],
  ['authorization'],
  async (params) => {

    // Extract name parameter with proper validation and defaults
    const name: string = (params.name as string)?.trim() || 'Guest'

    // Create UserManager instance and get user with trimmed name
    const userManager = new UserManager()
    const user: User = userManager.get(name)

    return RuntimeActionResponse.success(
      {
        message: `Hello, ${user.name}!`
      }
    )
  }
)

export { exampleAction }
