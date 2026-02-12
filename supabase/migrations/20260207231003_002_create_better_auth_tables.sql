/*
  # Create Better-Auth Tables

  1. New Tables
    - `user`
      - `id` (text, primary key) - Unique user identifier
      - `email` (text, unique, not null) - User email
      - `emailVerified` (boolean, default false) - Email verification status
      - `name` (text) - User display name
      - `createdAt` (timestamptz, default now()) - Account creation timestamp
      - `updatedAt` (timestamptz, default now()) - Last update timestamp
      - `image` (text) - User profile image URL

    - `session`
      - `id` (text, primary key) - Unique session identifier
      - `userId` (text, not null, fk) - Reference to user
      - `expiresAt` (timestamptz, not null) - Session expiration timestamp
      - `ipAddress` (text) - IP address of session
      - `userAgent` (text) - User agent string

    - `account`
      - `id` (text, primary key) - Unique account identifier
      - `userId` (text, not null, fk) - Reference to user
      - `accountId` (text, not null) - External account ID
      - `providerId` (text, not null) - OAuth provider ID
      - `accessToken` (text) - OAuth access token
      - `refreshToken` (text) - OAuth refresh token
      - `expiresAt` (timestamptz) - Token expiration
      - `password` (text) - Hashed password for email/password auth

    - `verification`
      - `id` (text, primary key) - Unique verification identifier
      - `identifier` (text, not null) - Email or phone to verify
      - `value` (text, not null) - Verification code/token
      - `expiresAt` (timestamptz, not null) - Verification expiration

  2. Security
    - Enable RLS on all tables
    - Users can only read their own data
    - Sessions are managed by the auth system
    - Accounts and verifications are restricted to auth system
*/

-- Create user table
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  name TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image TEXT
);

-- Create session table
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT
);

-- Create account table
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "expiresAt" TIMESTAMPTZ,
  password TEXT
);

-- Create verification table
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_userId ON session("userId");
CREATE INDEX IF NOT EXISTS idx_account_userId ON account("userId");
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);

-- Enable Row Level Security
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE account ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification ENABLE ROW LEVEL SECURITY;

-- User Policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON "user" FOR SELECT
  TO authenticated
  USING (id = auth.jwt() ->> 'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "user" FOR UPDATE
  TO authenticated
  USING (id = auth.jwt() ->> 'sub')
  WITH CHECK (id = auth.jwt() ->> 'sub');

-- Session Policies

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON session FOR SELECT
  TO authenticated
  USING ("userId" = auth.jwt() ->> 'sub');

-- Account Policies

-- Users can view their own accounts
CREATE POLICY "Users can view own accounts"
  ON account FOR SELECT
  TO authenticated
  USING ("userId" = auth.jwt() ->> 'sub');

-- Verification Policies (these are typically managed by the auth system)
-- No public policies for verification table