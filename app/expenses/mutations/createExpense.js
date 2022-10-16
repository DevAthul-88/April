import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const CreateExpense = z.object({
  userId: z.string(),
  name: z.string(),
  currency: z.string(),
  client: z.string(),
  note: z.string(),
  project: z.string(),
  amount: z.number(),
  date: z.string(),
  paid: z.boolean().nullable(),
  should: z.boolean().nullable(),
})
export default resolver.pipe(resolver.zod(CreateExpense), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expense = await db.expense.create({
    data: input,
  })
  return expense
})
