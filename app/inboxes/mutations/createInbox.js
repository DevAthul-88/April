import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const CreateInbox = z.object({
  name: z.string(),
});
export default resolver.pipe(
  resolver.zod(CreateInbox),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const inbox = await db.inbox.create({
      data: input,
    });
    return inbox;
  }
);
