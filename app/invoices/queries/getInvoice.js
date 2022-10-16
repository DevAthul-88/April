import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const GetInvoice = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})
export default resolver.pipe(resolver.zod(GetInvoice), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const invoice = await db.invoice.findFirst({
    where: {
      id,
    },
  })
  if (!invoice) throw new NotFoundError()
  return invoice
})
