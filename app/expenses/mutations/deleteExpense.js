import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const DeleteExpense = z.object({
  id: z.string(),
})
export default resolver.pipe(resolver.zod(DeleteExpense), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expense = await db.expense.deleteMany({
    where: {
      id,
    },
  })
  return expense
})
