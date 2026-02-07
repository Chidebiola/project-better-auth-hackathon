import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

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
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      createdAt: session.user.createdAt,
    },
    questions,
    stats: {
      questionsCount: questions.length,
      answersCount: Number(answerStats?.count ?? 0),
      acceptedAnswersCount: Number(acceptedStats?.count ?? 0),
    },
  })
}
