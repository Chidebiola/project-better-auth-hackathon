import { auth } from "@/lib/auth"
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  // Verify question belongs to the current user
  const questions = await query<{ id: string; author_id: string }>(
    "SELECT id, author_id FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].author_id !== session.user.id) {
    return Response.json({ error: "Only the question author can edit" }, { status: 403 })
  }

  const body = await request.json()
  const { title, body: questionBody, category, bountyAmount } = body

  const setClauses: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`)
    values.push(title)
  }

  if (questionBody !== undefined) {
    setClauses.push(`body = $${paramIndex++}`)
    values.push(questionBody)
  }

  if (category !== undefined) {
    setClauses.push(`category = $${paramIndex++}`)
    values.push(category)
  }

  if (bountyAmount !== undefined) {
    setClauses.push(`bounty_amount = $${paramIndex++}`)
    values.push(bountyAmount)
  }

  if (setClauses.length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 })
  }

  setClauses.push(`updated_at = NOW()`)
  values.push(id)

  const updated = await query(
    `UPDATE questions SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
    values,
  )

  return Response.json(updated[0])
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const questions = await query<{ id: string; author_id: string }>(
    "SELECT id, author_id FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].author_id !== session.user.id) {
    return Response.json({ error: "Only the question author can delete" }, { status: 403 })
  }

  await query("DELETE FROM questions WHERE id = $1", [id])

  return Response.json({ success: true })
}
