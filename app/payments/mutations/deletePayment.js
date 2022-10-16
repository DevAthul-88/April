import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const DeletePayment = z.object({
  id: z.number(),
});
export default resolver.pipe(
  resolver.zod(DeletePayment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const payment = await db.payment.deleteMany({
      where: {
        id,
      },
    });
    return payment;
  }
);
