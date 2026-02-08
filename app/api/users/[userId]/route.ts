import { query } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params

  const users = await query<{
    id: string
    name: string
    email: string
    createdAt: string
  }>(
    `SELECT id, name, email, "createdAt" FROM "user" WHERE id = $1`,
    [userId],
  )

  if (users.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const user = users[0]

  const questions = await query(
    `SELECT
      q.*,
      u.name as author_name,
      COALESCE((SELECT COUNT(*)::int FROM answers a WHERE a.question_id = q.id), 0) as answer_count
    FROM questions q
    LEFT JOIN "user" u ON q.author_id = u.id
    WHERE q.author_id = $1
    ORDER BY q.created_at DESC`,
    [userId],
  )

  const [answerStats] = await query<{ count: string }>(
    `SELECT COUNT(*)::int as count FROM answers WHERE author_id = $1`,
    [userId],
  )

  const [acceptedStats] = await query<{ count: string }>(
    `SELECT COUNT(*)::int as count FROM answers WHERE author_id = $1 AND is_accepted = true`,
    [userId],
  )

  return Response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    questions,
    stats: {
      questionsCount: questions.length,
      answersCount: Number(answerStats?.count ?? 0),
      acceptedAnswersCount: Number(acceptedStats?.count ?? 0),
    },
  })
}
