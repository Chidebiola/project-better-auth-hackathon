-- Researcher profile: identity/org verification + basic info (flow: Verify identity/org + complete profile)
CREATE TABLE IF NOT EXISTS researcher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  affiliation TEXT,
  email_for_verification TEXT,
  areas_of_interest TEXT[] DEFAULT '{}',
  homepage TEXT,
  alternative_names TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_researcher_profiles_user ON researcher_profiles(user_id);
