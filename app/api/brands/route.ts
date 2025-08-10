import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const brandsFile = path.join(process.cwd(), 'data', 'brands.json');

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 saat

export async function GET(req: NextRequest) {
  try {
    const data = await fs.readFile(brandsFile, 'utf-8');
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Markalar okunamadı.' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await fs.writeFile(brandsFile, JSON.stringify(body, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Markalar kaydedilemedi.' }), { status: 500 });
  }
} 