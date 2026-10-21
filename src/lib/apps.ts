import taxonomy from '../data/taxonomy.json';
import type { Locale } from './i18n';

export interface AppDownload {
  os: 'mac' | 'windows' | 'linux';
  label: string;
  url: string;
  size?: number;
}

export interface AppInstall {
  brew?: string;
  mas?: string;
  testflight?: string;
  /** direct download assets, auto-filled by sync from the latest release */
  downloads?: AppDownload[];
}

export interface AppZH {
  tagline: string;
  description: string;
}

/** Article body block: paragraph in EN/ZH, or an inline image (alt in EN). */
export type AppBodyBlock =
  | { type: 'p'; en: string; zh: string }
  | { type: 'img'; src: string; alt: string };

export interface AppMeta {
  stars: number;
  lastRelease: string;
  arch?: string;
  updatedAt: string;
}

export interface App {
  slug: string;
  name: string;
  tagline: string;
  repo: string;
  website?: string;
  platforms: string[];
  categories: string[];
  license: string;
  install: AppInstall;
  meta: AppMeta;
  description: string;
  logo?: string;
  tags?: string[];
  images?: { src: string; alt: string }[];
  body?: AppBodyBlock[];
  zh?: AppZH;
}

/** Tagline + description in the requested locale (falls back to EN). */
export function appText(app: App, locale: Locale) {
  return locale === 'zh' && app.zh ? app.zh : { tagline: app.tagline, description: app.description };
}

/** Category name/description in the requested locale (falls back to EN). */
export function categoryText(cat: (typeof taxonomy.categories)[number], locale: Locale) {
  return locale === 'zh' && cat.name_zh
    ? { name: cat.name_zh, description: cat.description_zh ?? cat.description }
    : { name: cat.name, description: cat.description };
}

/** Platform name/tagline in the requested locale (falls back to EN). */
export function platformText(p: (typeof taxonomy.platforms)[number], locale: Locale) {
  return locale === 'zh' && p.name_zh
    ? { name: p.name_zh, tagline: p.tagline_zh ?? p.tagline }
    : { name: p.name, tagline: p.tagline };
}

const modules = import.meta.glob<App>('../data/apps/*.json', { eager: true });

export const allApps: App[] = Object.values(modules)
  .map((m) => m.default ?? (m as unknown as App))
  .sort((a, b) => b.meta.stars - a.meta.stars);

export function getApp(slug: string): App | undefined {
  return allApps.find((a) => a.slug === slug);
}

export function appsByCategory(categoryId: string): App[] {
  return allApps.filter((a) => a.categories.includes(categoryId));
}

export function appsByPlatform(platformId: string): App[] {
  return allApps.filter((a) => a.platforms.includes(platformId));
}

/** Launch gate: listing pages ship once they have real inventory — thin pages stay offline. */
export const MIN_LISTING_ITEMS = 1;
export const liveCategories = taxonomy.categories.filter(
  (c) => appsByCategory(c.id).length >= MIN_LISTING_ITEMS,
);
export const livePlatforms = taxonomy.platforms.filter(
  (p) => appsByPlatform(p.id).length >= MIN_LISTING_ITEMS,
);

/** Reviews are passed in by pages (astro:content is page-scoped). */
export function reviewsForApp(appSlug: string, reviews: { data: { app: string } }[]) {
  return reviews.filter((r) => r.data.app === appSlug);
}

const MONTH = 30 * 24 * 60 * 60 * 1000;

export type Activity = 'active' | 'stale' | 'unmaintained';

export function activityOf(app: App, now = Date.now()): Activity {
  const age = now - new Date(app.meta.lastRelease).getTime();
  if (age > 12 * MONTH) return 'unmaintained';
  if (age > 6 * MONTH) return 'stale';
  return 'active';
}

export const activityLabel: Record<Activity, string> = {
  active: 'Active',
  stale: 'Slowing down',
  unmaintained: 'Unmaintained',
};

export function categoryById(id: string) {
  return taxonomy.categories.find((c) => c.id === id);
}

export function platformById(id: string) {
  return taxonomy.platforms.find((p) => p.id === id);
}

export const categories = taxonomy.categories;
export const platforms = taxonomy.platforms;

export function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
}

export function formatRepoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}
