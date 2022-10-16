import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const CreatePayment = z.object({
  userId: z.string(),
  date: z.string(),
  method: z.string(),
  invoiceId: z.string(),
  amount: z.number(),
  currency: z.string(),
  ref: z.string(),
})
export default resolver.pipe(resolver.zod(CreatePayment), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const { invoiceId } = input
  await db.invoice.update({
    where: {
      id: invoiceId,
    },
    data: { status: "PAID" },
  })
  const payment = await db.payment.create({
    data: input,
  })
  return payment
})
