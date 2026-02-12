/*
  # Create Questions and Answers Platform Schema

  1. New Tables
    - `questions`
      - `id` (uuid, primary key) - Unique identifier for each question
      - `author_id` (text, not null) - User ID of the question author
      - `title` (text, not null) - Question title
      - `body` (text, not null) - Question body/description
      - `bounty_amount` (integer, default 0) - Bounty points offered
      - `category` (text, default 'all') - Question category
      - `status` (text, default 'open') - Question status (open, answered, closed)
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

    - `answers`
      - `id` (uuid, primary key) - Unique identifier for each answer
      - `question_id` (uuid, not null, fk) - Reference to parent question
      - `author_id` (text, not null) - User ID of the answer author
      - `body` (text, not null) - Answer content
      - `is_accepted` (boolean, default false) - Whether this is the accepted answer
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Questions:
      - Anyone can view questions (public read)
      - Authenticated users can create questions
      - Authors can update their own questions
      - Authors can delete their own questions
    - Answers:
      - Anyone can view answers (public read)
      - Authenticated users can create answers
      - Authors can update their own answers
      - Authors can delete their own answers
      - Question authors can accept answers on their questions

  3. Indexes
    - Performance indexes on frequently queried columns
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  bounty_amount INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author ON answers(author_id);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Questions Policies

-- Anyone can view questions
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  USING (true);

-- Authenticated users can create questions
CREATE POLICY "Authenticated users can create questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authors can update their own questions
CREATE POLICY "Authors can update own questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (author_id = auth.jwt() ->> 'sub')
  WITH CHECK (author_id = auth.jwt() ->> 'sub');

-- Authors can delete their own questions
CREATE POLICY "Authors can delete own questions"
  ON questions FOR DELETE
  TO authenticated
  USING (author_id = auth.jwt() ->> 'sub');

-- Answers Policies

-- Anyone can view answers
CREATE POLICY "Anyone can view answers"
  ON answers FOR SELECT
  USING (true);

-- Authenticated users can create answers
CREATE POLICY "Authenticated users can create answers"
  ON answers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authors can update their own answers
CREATE POLICY "Authors can update own answers"
  ON answers FOR UPDATE
  TO authenticated
  USING (author_id = auth.jwt() ->> 'sub')
  WITH CHECK (author_id = auth.jwt() ->> 'sub');

-- Authors can delete their own answers
CREATE POLICY "Authors can delete own answers"
  ON answers FOR DELETE
  TO authenticated
  USING (author_id = auth.jwt() ->> 'sub');