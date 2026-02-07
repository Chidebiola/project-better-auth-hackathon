import { query } from "@/lib/db"
import type { Answer, AnswerRequest } from "@/lib/types"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const questions = await query(
    `SELECT
      q.*,
      u.name as author_name,
      COALESCE((SELECT COUNT(*)::int FROM answers a WHERE a.question_id = q.id), 0) as answer_count
    FROM questions q
    LEFT JOIN "user" u ON q.author_id = u.id
    WHERE q.id = $1`,
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  const answers = await query<Answer>(
    `SELECT
      a.*,
      u.name as author_name
    FROM answers a
    LEFT JOIN "user" u ON a.author_id = u.id
    WHERE a.question_id = $1
    ORDER BY a.is_accepted DESC, a.created_at ASC`,
    [id],
  )

  const answerRequests = await query<AnswerRequest>(
    `SELECT
      ar.*,
      u.name as user_name
    FROM answer_requests ar
    LEFT JOIN "user" u ON ar.user_id = u.id
    WHERE ar.question_id = $1
    ORDER BY ar.created_at ASC`,
    [id],
  )

  return Response.json({ ...questions[0], answers, answer_requests: answerRequests })
}
