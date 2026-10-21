/**
 * Build-time feature flags. Absent env var = disabled (fail-safe default).
 */
export const COMMENTS_ENABLED = import.meta.env.PUBLIC_COMMENTS_ENABLED === 'true';
