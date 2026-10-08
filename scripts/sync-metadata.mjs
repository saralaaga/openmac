#!/usr/bin/env node
/**
 * Syncs GitHub metadata (stars / last release / license) into src/data/apps/*.json.
 * Runs daily via .github/workflows/sync-metadata.yml and commits the diff.
 *
 * Requires GITHUB_TOKEN (the workflow's default token is enough — no scopes
 * beyond public repo read).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const APPS_DIR = new URL('../src/data/apps/', import.meta.url).pathname;
const TOKEN = process.env.GITHUB_TOKEN;
const today = new Date().toISOString().slice(0, 10);

async function fetchRepo(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      'User-Agent': 'openmac-metadata-sync',
    },
  });
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`);
  return res.json();
}

async function fetchLatestRelease(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      'User-Agent': 'openmac-metadata-sync',
    },
  });
  if (!res.ok) return null; // repos without releases return 404
  const data = await res.json();
  return data.published_at?.slice(0, 10) ?? null;
}

const files = (await readdir(APPS_DIR)).filter((f) => f.endsWith('.json'));
let changed = 0;

for (const file of files) {
  const path = join(APPS_DIR, file);
  const app = JSON.parse(await readFile(path, 'utf8'));
  if (!app.repo) continue;

  try {
    const repo = await fetchRepo(app.repo);
    const release = (await fetchLatestRelease(app.repo)) ?? repo.pushed_at?.slice(0, 10);

    const next = {
      ...app,
      license: repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION'
        ? repo.license.spdx_id
        : app.license,
      meta: {
        ...app.meta,
        stars: repo.stargazers_count ?? app.meta.stars,
        lastRelease: release ?? app.meta.lastRelease,
        updatedAt: today,
      },
    };

    const before = JSON.stringify(app, null, 2);
    const after = JSON.stringify(next, null, 2);
    if (before !== after) {
      await writeFile(path, after + '\n', 'utf8');
      changed++;
      console.log(`✓ ${app.slug}: stars=${next.meta.stars} lastRelease=${next.meta.lastRelease}`);
    }
  } catch (err) {
    console.warn(`⚠ skipping ${app.slug}: ${err.message}`);
  }
}

console.log(`Done. ${changed}/${files.length} apps updated.`);
