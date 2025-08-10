import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const QUOTES_PATH = path.join(process.cwd(), 'data', 'quotes.json');

async function readQuotes() {
  try {
    const data = await fs.readFile(QUOTES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeQuotes(quotes: any[]) {
  await fs.writeFile(QUOTES_PATH, JSON.stringify(quotes, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const quotes = await readQuotes();
  // Sort by createdAt descending
  quotes.sort((a, b) => (b.createdAt || 0).localeCompare(a.createdAt || 0));
  return new NextResponse(JSON.stringify(quotes), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const quotes = await readQuotes();
  const newQuote = {
    ...data,
    id: Date.now().toString(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  quotes.unshift(newQuote);
  await writeQuotes(quotes);
  return NextResponse.json({ success: true, quote: newQuote });
}

export async function PATCH(req: NextRequest) {
  const { id, read } = await req.json();
  const quotes = await readQuotes();
  const idx = quotes.findIndex(q => q.id === id);
  if (idx !== -1) {
    quotes[idx].read = read;
    await writeQuotes(quotes);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let quotes = await readQuotes();
  quotes = quotes.filter(q => q.id !== id);
  await writeQuotes(quotes);
  return NextResponse.json({ success: true });
}
