import type { MetadataRoute } from 'next';

function origin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const base = origin();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
