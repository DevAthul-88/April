import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const DeleteInbox = z.object({
  id: z.number(),
});
export default resolver.pipe(
  resolver.zod(DeleteInbox),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const inbox = await db.inbox.deleteMany({
      where: {
        id,
      },
    });
    return inbox;
  }
);
