import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(
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

  // Verify question exists and is open
  const questions = await query<{ id: string; author_id: string; status: string }>(
    "SELECT id, author_id, status FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].status === "closed") {
    return Response.json({ error: "Question is closed" }, { status: 400 })
  }

  // Can't volunteer for your own question
  if (questions[0].author_id === session.user.id) {
    return Response.json({ error: "You cannot volunteer for your own question" }, { status: 400 })
  }

  // Check if already volunteered
  const existing = await query(
    "SELECT id FROM answer_requests WHERE question_id = $1 AND user_id = $2",
    [id, session.user.id],
  )

  if (existing.length > 0) {
    return Response.json({ error: "You have already volunteered" }, { status: 400 })
  }

  const result = await query(
    `INSERT INTO answer_requests (question_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [id, session.user.id],
  )

  return Response.json(result[0], { status: 201 })
}
