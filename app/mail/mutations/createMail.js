import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const CreateMail = z.object({
  userId: z.string(),
  name: z.string(),
  client: z.string(),
  note: z.string(),
  seen: z.boolean().nullable(),
})
export default resolver.pipe(resolver.zod(CreateMail), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const user = await db.user.findFirst({
    where: {
      email: input.client,
    },
  })
  if (!user) {
    throw new Error("No user found, Please select a user that the user also uses April.")
  } else {
    const mail = await db.mail.create({
      data: input,
    })
    return mail
  }
})
