import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
const UpdateProject = z.object({
  name: z.string(),
  note: z.string(),
  userId: z.string(),
  start: z.string(),
  status: z.string(),
})
export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.update({
      where: {
        id,
      },
      data,
    })
    return project
  }
)
