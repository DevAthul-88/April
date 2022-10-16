import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const CreateInvoice = z.object({
  project: z.string(),
  client: z.string(),
  userId: z.string(),
  issue: z.string(),
  due: z.string(),
  tax: z.number(),
  discount: z.number(),
  note: z.string(),
  currency: z.string(),
  meta: z.array(
    z.object({
      details: z.string(),
      quantity: z.string(),
      price: z.string(),
    })
  ),
})
export default resolver.pipe(resolver.zod(CreateInvoice), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  console.log(input)
  const invoice = await db.invoice.create({
    data: input,
  })
  return invoice
})
