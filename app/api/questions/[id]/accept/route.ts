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
  const { answerId } = body

  if (!answerId) {
    return Response.json({ error: "Answer ID is required" }, { status: 400 })
  }

  // Verify question belongs to user
  const questions = await query<{ id: string; author_id: string }>(
    "SELECT id, author_id FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].author_id !== session.user.id) {
    return Response.json({ error: "Only the question author can accept answers" }, { status: 403 })
  }

  // Reset any previously accepted answer, then accept the new one
  await query(
    "UPDATE answers SET is_accepted = FALSE WHERE question_id = $1",
    [id],
  )

  await query(
    "UPDATE answers SET is_accepted = TRUE, updated_at = NOW() WHERE id = $1 AND question_id = $2",
    [answerId, id],
  )

  await query(
    "UPDATE questions SET status = 'answered', updated_at = NOW() WHERE id = $1",
    [id],
  )

  return Response.json({ success: true })
}
