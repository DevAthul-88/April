import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const GetMail = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})
export default resolver.pipe(resolver.zod(GetMail), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const mail = await db.mail.findFirst({
    where: {
      id,
    },
  })
  if (!mail) throw new NotFoundError()
  return mail
})
