import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const pricesFile = path.join(process.cwd(), 'data', 'prices.json');

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 saat

export async function GET(req: NextRequest) {
  try {
    const data = await fs.readFile(pricesFile, 'utf-8');
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fiyatlar okunamadı.' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await fs.writeFile(pricesFile, JSON.stringify(body, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fiyatlar kaydedilemedi.' }), { status: 500 });
  }
} 