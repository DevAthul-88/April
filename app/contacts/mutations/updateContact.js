import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const UpdateContact = z.object({
  id: z.string(),
  name: z.string(),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  gender: z.string(),
  note: z.string(),
  userId: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  company: z.string().nullable(),
  client: z.string(),
  website: z.string().nullable(),
})
export default resolver.pipe(
  resolver.zod(UpdateContact),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contact = await db.contact.update({
      where: {
        id,
      },
      data,
    })
    return contact
  }
)
