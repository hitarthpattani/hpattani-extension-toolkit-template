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
import { RuntimeAction, HttpMethod, RuntimeActionResponse, AdminUiSdk } from '@adobe-commerce/aio-toolkit'

export const main = RuntimeAction.execute(
  'admin-ui-sdk-registration-action',
  [HttpMethod.GET, HttpMethod.POST],
  [],
  [],
  async () => {
    const adminUiSdk = new AdminUiSdk(EXTENSION_ID);
    
    adminUiSdk.addMenuItem('app_builder_extension', 'App Builder Extension', 100, 'apps');
    adminUiSdk.addMenuSection('apps', 'Apps', 100);
    adminUiSdk.addPage('App Builder Extension');
    
    const registration = await adminUiSdk.getRegistration();
    
    return RuntimeActionResponse.success(registration);
  }
);
