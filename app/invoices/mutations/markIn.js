import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const UpdateInvoice = z.object({
  id: z.string(),
})
export default resolver.pipe(
  resolver.zod(UpdateInvoice),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const invoice = await db.invoice.update({
      where: {
        id,
      },
      data: {
        status: "PENDING",
      },
    })
    return invoice
  }
)
