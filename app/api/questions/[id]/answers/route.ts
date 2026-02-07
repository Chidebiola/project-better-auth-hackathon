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
  const body = await request.json()

  if (!body.body) {
    return Response.json({ error: "Answer body is required" }, { status: 400 })
  }

  // Verify question exists and is open
  const questions = await query<{ id: string; status: string }>(
    "SELECT id, status FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].status === "closed") {
    return Response.json({ error: "Question is closed" }, { status: 400 })
  }

  // Check if user has been selected to answer
  const selectedRequests = await query<{ id: string }>(
    "SELECT id FROM answer_requests WHERE question_id = $1 AND user_id = $2 AND status = 'selected'",
    [id, session.user.id],
  )

  if (selectedRequests.length === 0) {
    return Response.json({ error: "You must be selected by the question author to answer" }, { status: 403 })
  }

  const answers = await query(
    `INSERT INTO answers (question_id, author_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, session.user.id, body.body],
  )

  return Response.json(answers[0], { status: 201 })
}
