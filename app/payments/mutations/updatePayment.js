import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const UpdatePayment = z.object({
  id: z.number(),
  name: z.string(),
});
export default resolver.pipe(
  resolver.zod(UpdatePayment),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const payment = await db.payment.update({
      where: {
        id,
      },
      data,
    });
    return payment;
  }
);
