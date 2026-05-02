import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/*', '/api/', '/api/*', '/comparar', '/favoritos'],
      },
    ],
    sitemap: 'https://www.carlaoimoveismg.com.br/sitemap.xml',
  };
}
