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

-- RLS policies
ALTER TABLE answer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON answer_requests
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create requests" ON answer_requests
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Question authors can update requests" ON answer_requests
  FOR UPDATE USING (true);
