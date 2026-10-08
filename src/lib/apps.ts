import taxonomy from '../data/taxonomy.json';

export interface AppInstall {
  brew?: string;
  mas?: string;
  testflight?: string;
  dmg?: string;
}

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
