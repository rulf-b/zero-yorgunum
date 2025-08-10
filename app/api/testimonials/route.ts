import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getClientIP, isRateLimited } from '@/lib/auth';
import { validateTestimonial, sanitizeString } from '@/lib/validation';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 saat

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'testimonials.json');
    
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!exists) {
      return NextResponse.json([], { status: 200 });
    }
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    const testimonials = JSON.parse(fileContents);
    
    return new NextResponse(JSON.stringify(testimonials), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json({ error: 'Veriler yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP, 3, 300000)) { // 3 requests per 5 minutes
      return NextResponse.json({ error: 'Çok fazla istek. 5 dakika sonra tekrar deneyin.' }, { status: 429 });
    }

    const body = await request.json();
    
    // Input validation
    const validation = validateTestimonial(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(' ') }, { status: 400 });
    }

    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'testimonials.json');
    
    let testimonials = [];
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (exists) {
      const fileContents = await fs.readFile(filePath, 'utf8');
      testimonials = JSON.parse(fileContents);
    }
    
    // Sanitize inputs
    const newTestimonial = {
      id: (testimonials.length + 1).toString(),
      name: sanitizeString(body.name, 100),
      comment: sanitizeString(body.comment, 1000),
      location: sanitizeString(body.location, 100),
      service: sanitizeString(body.service, 200),
      rating: Math.max(1, Math.min(5, parseInt(body.rating) || 5)),
      date: new Date().toISOString().split('T')[0],
      verified: false // New testimonials default to unverified
    };
    
    testimonials.push(newTestimonial);
    
    await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return NextResponse.json({ error: 'Yorum eklenemedi.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'testimonials.json');
    
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!exists) {
      return NextResponse.json({ error: 'No testimonials found' }, { status: 404 });
    }
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    let testimonials = JSON.parse(fileContents);
    
    // Testimonial'ı güncelle
    const index = testimonials.findIndex((t: any) => t.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    testimonials[index] = { ...testimonials[index], ...body };
    
    await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json(testimonials[index], { status: 200 });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'testimonials.json');
    
    const exists2 = await fs.stat(filePath).then(() => true).catch(() => false);
    if (!exists2) {
      return NextResponse.json({ error: 'No testimonials found' }, { status: 404 });
    }
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    let testimonials = JSON.parse(fileContents);
    
    // Testimonial'ı sil
    const index = testimonials.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    const deletedTestimonial = testimonials.splice(index, 1)[0];
    
    await fs.writeFile(filePath, JSON.stringify(testimonials, null, 2));
    
    return NextResponse.json({ message: 'Testimonial deleted successfully', deletedTestimonial }, { status: 200 });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}