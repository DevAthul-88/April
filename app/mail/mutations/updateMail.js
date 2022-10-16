import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
const UpdateMail = z.object({
  id: z.number(),
  name: z.string(),
});
export default resolver.pipe(
  resolver.zod(UpdateMail),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const mail = await db.mail.update({
      where: {
        id,
      },
      data,
    });
    return mail;
  }
);
