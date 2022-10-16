import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: inboxes,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () =>
        db.inbox.count({
          where,
        }),
      query: (paginateArgs) =>
        db.inbox.findMany({ ...paginateArgs, where, orderBy }),
    });
    return {
      inboxes,
      nextPage,
      hasMore,
      count,
    };
  }
);
