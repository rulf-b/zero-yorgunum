import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sanitizeString } from '@/lib/validation';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 saat

const blogPostsFile = path.join(process.cwd(), 'data', 'blog-posts.json');

export async function GET(req: NextRequest) {
  try {
    const data = await fs.readFile(blogPostsFile, 'utf-8');
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Blog yazıları okunamadı.' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize blog post data before saving
    const sanitizedPosts = Array.isArray(body) ? body.map(post => ({
      ...post,
      title: sanitizeString(post.title, 200),
      content: sanitizeString(post.content, 10000),
      excerpt: sanitizeString(post.excerpt, 500),
      author: sanitizeString(post.author, 100),
      tags: Array.isArray(post.tags) ? post.tags.map((tag: string) => sanitizeString(tag, 50)) : []
    })) : body;
    
    await fs.writeFile(blogPostsFile, JSON.stringify(sanitizedPosts, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Blog yazıları kaydedilemedi.' }), { status: 500 });
  }
} 