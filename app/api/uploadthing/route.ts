/**
 * Handlers HTTP GET/POST pour UploadThing, branchés sur ourFileRouter.
 */

import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
