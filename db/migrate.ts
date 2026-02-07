import { readFileSync } from "node:fs"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const sql = readFileSync("db/migrations/001_initial.sql", "utf-8")

try {
  await pool.query(sql)
  console.log("Migration completed successfully")
} catch (error) {
  console.error("Migration failed:", error)
  process.exit(1)
} finally {
  await pool.end()
}
