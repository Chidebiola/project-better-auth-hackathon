CREATE TABLE IF NOT EXISTS answer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'selected', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_answer_requests_unique ON answer_requests(question_id, user_id);
CREATE INDEX IF NOT EXISTS idx_answer_requests_question ON answer_requests(question_id);
CREATE INDEX IF NOT EXISTS idx_answer_requests_user ON answer_requests(user_id);
