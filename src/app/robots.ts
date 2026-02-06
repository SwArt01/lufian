import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://lufian.com.tr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/account/orders',
                    '/account/wishlist',
                    '/account/addresses',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
