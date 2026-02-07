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
  const { userId } = body

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 })
  }

  // Verify question belongs to the current user
  const questions = await query<{ id: string; author_id: string }>(
    "SELECT id, author_id FROM questions WHERE id = $1",
    [id],
  )

  if (questions.length === 0) {
    return Response.json({ error: "Question not found" }, { status: 404 })
  }

  if (questions[0].author_id !== session.user.id) {
    return Response.json({ error: "Only the question author can select volunteers" }, { status: 403 })
  }

  // Verify the volunteer request exists
  const requests = await query<{ id: string; status: string }>(
    "SELECT id, status FROM answer_requests WHERE question_id = $1 AND user_id = $2",
    [id, userId],
  )

  if (requests.length === 0) {
    return Response.json({ error: "Volunteer request not found" }, { status: 404 })
  }

  // Toggle: if already selected, set back to pending; otherwise select
  const newStatus = requests[0].status === "selected" ? "pending" : "selected"

  await query(
    "UPDATE answer_requests SET status = $1 WHERE question_id = $2 AND user_id = $3",
    [newStatus, id, userId],
  )

  return Response.json({ success: true, status: newStatus })
}
