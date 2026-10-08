-- better-auth schema for D1 (camelCase columns, better-auth 1.7.x convention)
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" integer DEFAULT 0 NOT NULL,
  "image" text,
  "createdAt" real NOT NULL,
  "updatedAt" real NOT NULL
);
CREATE TABLE "session" (
  "id" text PRIMARY KEY,
  "expiresAt" real NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" real NOT NULL,
  "updatedAt" real NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL
);
CREATE TABLE "account" (
  "id" text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" real,
  "refreshTokenExpiresAt" real,
  "scope" text,
  "password" text,
  "createdAt" real NOT NULL,
  "updatedAt" real NOT NULL
);
CREATE TABLE "verification" (
  "id" text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" real NOT NULL,
  "createdAt" real NOT NULL,
  "updatedAt" real NOT NULL
);
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
