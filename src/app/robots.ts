import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://image-compression-tool.vercel.app/sitemap.xml', // あなたのサイトのURLに変更してください
  }
} 