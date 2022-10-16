import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const CreateContact = z.object({
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
export default resolver.pipe(resolver.zod(CreateContact), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const contact = await db.contact.create({
    data: input,
  })
  return contact
})
