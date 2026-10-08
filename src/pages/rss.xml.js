import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const reviews = await getCollection('reviews', (r) => !r.data.draft);
  return rss({
    title: 'OpenMac — Reviews',
    description:
      'Hands-on reviews of open source apps for the Apple ecosystem. Free your Mac.',
    site: context.site,
    items: reviews
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((r) => ({
        title: r.data.title,
        description: r.data.description,
        pubDate: r.data.pubDate,
        link: `/reviews/${r.id}/`,
      })),
  });
}
