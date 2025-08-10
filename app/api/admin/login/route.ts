import { NextRequest, NextResponse } from 'next/server';
import { auditLog, logger } from '@/lib/logger';
import { getClientIP, isRateLimited } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP, 5, 300000)) { // 5 attempts per 5 minutes
      return NextResponse.json({ error: 'Çok fazla giriş denemesi. 5 dakika bekleyin.' }, { status: 429 });
    }

    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli.' }, { status: 400 });
    }

    // Get admin credentials from environment with production fallbacks
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "temp_password_change_me";
    
    // Security warning for default credentials
    if (ADMIN_PASSWORD === "temp_password_change_me") {
      logger.warn("WARNING: Using default admin password! Change ADMIN_PASSWORD environment variable.");
    }
    
    // Validate admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      auditLog.loginAttempt(clientIP, true, username);
      return NextResponse.json({ 
        success: true, 
        message: 'Giriş başarılı',
        userType: 'admin1'
      });
    }

    // Log failed attempt
    auditLog.loginAttempt(clientIP, false, username);
    return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı.' }, { status: 401 });
    
  } catch (error) {
    logger.error('Admin login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
