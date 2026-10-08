-- Self-hosted comments (phase 2): better-auth accounts + D1, replaces Giscus
CREATE TABLE IF NOT EXISTS "comment" (
  "id" text PRIMARY KEY,
  "target" text NOT NULL,
  "userId" text NOT NULL,
  "body" text NOT NULL,
  "createdAt" real NOT NULL,
  "hidden" integer DEFAULT 0 NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comment_target ON "comment"("target", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_comment_user ON "comment"("userId", "createdAt" DESC);
