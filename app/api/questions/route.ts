import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const status = url.searchParams.get("status")

  let sql = `
    SELECT
      q.*,
      u.name as author_name,
      COALESCE((SELECT COUNT(*)::int FROM answers a WHERE a.question_id = q.id), 0) as answer_count
    FROM questions q
    LEFT JOIN "user" u ON q.author_id = u.id
    WHERE 1=1
  `
  const params: unknown[] = []
  let paramIndex = 1

  if (category && category !== "all") {
    sql += ` AND q.category = $${paramIndex++}`
    params.push(category)
  }

  if (status) {
    sql += ` AND q.status = $${paramIndex++}`
    params.push(status)
  }

  sql += ` ORDER BY q.created_at DESC`

  const questions = await query(sql, params)
  return Response.json(questions)
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, body: questionBody, bountyAmount, category } = body

  if (!title || !questionBody) {
    return Response.json({ error: "Title and body are required" }, { status: 400 })
  }

  const questions = await query(
    `INSERT INTO questions (author_id, title, body, bounty_amount, category)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [session.user.id, title, questionBody, bountyAmount || 0, category || "all"],
  )

  return Response.json(questions[0], { status: 201 })
}
