import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const DeleteClient = z.object({
  id: z.string(),
})
export default resolver.pipe(resolver.zod(DeleteClient), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const client = await db.client.deleteMany({
    where: {
      id,
    },
  })
  return client
})
