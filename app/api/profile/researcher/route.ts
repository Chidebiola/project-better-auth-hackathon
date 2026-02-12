import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export type ResearcherProfileRow = {
  id: string
  user_id: string
  affiliation: string | null
  email_for_verification: string | null
  areas_of_interest: string[] | null
  homepage: string | null
  alternative_names: string[] | null
  created_at: string
  updated_at: string
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await query<ResearcherProfileRow>(
    `SELECT id, user_id, affiliation, email_for_verification, areas_of_interest, homepage, alternative_names, created_at, updated_at
     FROM researcher_profiles WHERE user_id = $1`,
    [session.user.id],
  )

  const row = rows[0]
  if (!row) {
    return Response.json({ profile: null })
  }

  return Response.json({
    profile: {
      id: row.id,
      userId: row.user_id,
      affiliation: row.affiliation ?? "",
      emailForVerification: row.email_for_verification ?? "",
      areasOfInterest: row.areas_of_interest ?? [],
      homepage: row.homepage ?? "",
      alternativeNames: row.alternative_names ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  })
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as {
    affiliation?: string
    emailForVerification?: string
    areasOfInterest?: string[]
    homepage?: string
    alternativeNames?: string[]
  }

  const existing = await query<ResearcherProfileRow>(
    `SELECT * FROM researcher_profiles WHERE user_id = $1`,
    [session.user.id],
  )
  const current = existing[0]

  const affiliation =
    body.affiliation !== undefined ? (body.affiliation?.trim() || null) : (current?.affiliation ?? null)
  const emailForVerification =
    body.emailForVerification !== undefined
      ? (body.emailForVerification?.trim() || null)
      : (current?.email_for_verification ?? null)
  const areasOfInterest =
    body.areasOfInterest !== undefined
      ? (Array.isArray(body.areasOfInterest) ? body.areasOfInterest.filter(Boolean) : [])
      : (current?.areas_of_interest ?? [])
  const homepage =
    body.homepage !== undefined ? (body.homepage?.trim() || null) : (current?.homepage ?? null)
  const alternativeNames =
    body.alternativeNames !== undefined
      ? (Array.isArray(body.alternativeNames) ? body.alternativeNames.filter(Boolean) : [])
      : (current?.alternative_names ?? [])

  await query(
    `INSERT INTO researcher_profiles (user_id, affiliation, email_for_verification, areas_of_interest, homepage, alternative_names, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       affiliation = EXCLUDED.affiliation,
       email_for_verification = EXCLUDED.email_for_verification,
       areas_of_interest = EXCLUDED.areas_of_interest,
       homepage = EXCLUDED.homepage,
       alternative_names = EXCLUDED.alternative_names,
       updated_at = NOW()`,
    [
      session.user.id,
      affiliation,
      emailForVerification,
      areasOfInterest,
      homepage,
      alternativeNames,
    ],
  )

  const rows = await query<ResearcherProfileRow>(
    `SELECT id, user_id, affiliation, email_for_verification, areas_of_interest, homepage, alternative_names, created_at, updated_at
     FROM researcher_profiles WHERE user_id = $1`,
    [session.user.id],
  )
  const row = rows[0]
  if (!row) {
    return Response.json({ error: "Failed to read back profile" }, { status: 500 })
  }

  return Response.json({
    profile: {
      id: row.id,
      userId: row.user_id,
      affiliation: row.affiliation ?? "",
      emailForVerification: row.email_for_verification ?? "",
      areasOfInterest: row.areas_of_interest ?? [],
      homepage: row.homepage ?? "",
      alternativeNames: row.alternative_names ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  })
}
