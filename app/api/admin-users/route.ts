import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAuthenticated, isAdminRequest, getClientIP, isRateLimited } from '@/lib/auth';
import { logger, auditLog } from '@/lib/logger';

const DATA_PATH = path.join(process.cwd(), 'data', 'admin2-user.json');

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP, 20, 60000)) {
      return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, { status: 429 });
    }

    // Authentication check for admin routes
    if (!isAdminRequest(req) && !isAuthenticated(req)) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    logger.error('Admin users GET error:', e);
    return NextResponse.json({ error: 'Veri okunamadı.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP, 5, 60000)) {
      return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, { status: 429 });
    }

    // Authentication check for admin routes
    if (!isAdminRequest(req) && !isAuthenticated(req)) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { username, password } = await req.json();
    
    // Input validation with stronger password requirements
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunlu.' }, { status: 400 });
    }
    
    if (username.length < 3 || password.length < 8) {
      return NextResponse.json({ error: 'Kullanıcı adı en az 3, şifre en az 8 karakter olmalı.' }, { status: 400 });
    }
    
    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json({ 
        error: 'Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermeli.' 
      }, { status: 400 });
    }

    await fs.writeFile(DATA_PATH, JSON.stringify({ username, password }, null, 2), 'utf-8');
    
    // Audit log
    const postClientIP = getClientIP(req);
    auditLog.adminAction('ADMIN2_PASSWORD_CHANGE', postClientIP, { username });
    
    return NextResponse.json({ success: true });
  } catch (e) {
    logger.error('Admin users POST error:', e);
    return NextResponse.json({ error: 'Kayıt hatası.' }, { status: 500 });
  }
} 