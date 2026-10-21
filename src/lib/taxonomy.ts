import type taxonomy from '../data/taxonomy.json';

export type TaxonomyCategory = (typeof taxonomy.categories)[number];
export type TaxonomyPlatform = (typeof taxonomy.platforms)[number];
