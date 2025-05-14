// app/sitemap.xml/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'

export async function GET() {
    
    const supabase = createClient();
    const SITE_URL = 'https://dental.bio'
  // Fetch active users
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('username')

  // Fetch published blog posts
  const { data: blogs, error: blogError } = await supabase
    .from('blogs')
    .select(`
        slug,
        blog_groups (
            user_id,
            users (
                id,
                username
            )
        )
    `)

  if (userError || blogError) {
    return new Response('Failed to generate sitemap', { status: 500 })
  }

  const urls = [
    { loc: SITE_URL },
    ...(users || []).map(user => ({
      loc: `${SITE_URL}/${user.username}`,
    })),
    ...(blogs || []).map(post => ({
      loc: `${SITE_URL}/${post.blog_groups?.users?.username}/blog/${post.slug}`,
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `<url>
  <loc>${url.loc}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
