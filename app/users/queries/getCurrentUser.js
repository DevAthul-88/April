import db from "db"
export default async function getCurrentUser(_ = null, { session }) {
  if (!session.userId) return null
  const user = await db.user.findFirst({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      company: true,
      role: true,
    },
  })
  return user
}
