import { query } from "@/lib/db"

export async function GET() {
  const users = await query(
    `SELECT
      u.id,
      u.name,
      u.email,
      u."createdAt",
      COALESCE((SELECT COUNT(*)::int FROM questions q WHERE q.author_id = u.id), 0) as questions_count,
      COALESCE((SELECT COUNT(*)::int FROM answers a WHERE a.author_id = u.id), 0) as answers_count,
      COALESCE((SELECT COUNT(*)::int FROM answers a WHERE a.author_id = u.id AND a.is_accepted = true), 0) as accepted_count
    FROM "user" u
    ORDER BY u."createdAt" DESC`,
  )

  return Response.json(users)
}
