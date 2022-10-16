import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const UpdateClient = z.object({
  id: z.string(),
  name: z.string(),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  gender: z.string(),
  note: z.string(),
  userId: z.string(),
  country: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  company: z.string().nullable(),
  website: z.string().nullable(),
})
export default resolver.pipe(
  resolver.zod(UpdateClient),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const client = await db.client.update({
      where: {
        id,
      },
      data,
    })
    return client
  }
)
