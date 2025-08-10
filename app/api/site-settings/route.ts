import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 saat

const siteSettingsFile = path.join(process.cwd(), 'data', 'site-settings.json');

export async function GET(req: NextRequest) {
  try {
    const exists = await fs.stat(siteSettingsFile).then(() => true).catch(() => false);
    if (exists) {
      const data = await fs.readFile(siteSettingsFile, 'utf-8');
      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
        },
      });
    } else {
      // Varsayılan ayarları döndür
      const defaultSettings = {
        companyName: 'Zero TV Servisi',
        phone: '+90 552 558 79 05',
        email: 'zero@ledtvpaneli.com',
        address: 'İstanbul, Türkiye',
        whatsapp: '+90 552 558 79 05',
        workingHours: [
          { day: 'Pazartesi', hours: '08:00 - 18:00' },
          { day: 'Salı', hours: '08:00 - 18:00' },
          { day: 'Çarşamba', hours: '08:00 - 18:00' },
          { day: 'Perşembe', hours: '08:00 - 18:00' },
          { day: 'Cuma', hours: '08:00 - 18:00' },
          { day: 'Cumartesi', hours: '08:00 - 17:00' },
          { day: 'Pazar', hours: 'Kapalı' }
        ],
        description: 'TV tamir ve servis hizmetleri'
      };
      return new Response(JSON.stringify(defaultSettings), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
        },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Site ayarları okunamadı.' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await fs.writeFile(siteSettingsFile, JSON.stringify(body, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Site ayarları kaydedilemedi.' }), { status: 500 });
  }
} 