import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const UpdateInbox = z.object({
  id: z.number(),
  name: z.string(),
});
export default resolver.pipe(
  resolver.zod(UpdateInbox),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const inbox = await db.inbox.update({
      where: {
        id,
      },
      data,
    });
    return inbox;
  }
);
