import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const DeleteMail = z.object({
  id: z.string(),
})
export default resolver.pipe(resolver.zod(DeleteMail), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const mail = await db.mail.update({
    where: {
      id,
    },
    data: {
      seen: true,
    },
  })
  return mail
})
