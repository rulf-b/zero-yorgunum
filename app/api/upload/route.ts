import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getClientIP, isRateLimited, isAdminRequest, isAuthenticated } from '@/lib/auth';

export const runtime = 'nodejs';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types and sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP, 10, 60000)) { // 10 uploads per minute
      return new Response(JSON.stringify({ error: 'Çok fazla yükleme. Lütfen bekleyin.' }), { status: 429 });
    }

    // Authentication check for admin uploads
    if (!isAdminRequest(req) && !isAuthenticated(req)) {
      return new Response(JSON.stringify({ error: 'Yetkisiz dosya yükleme.' }), { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'Dosya bulunamadı.' }), { status: 400 });
    }

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'Dosya boyutu 5MB\'dan büyük olamaz.' }), { status: 400 });
    }

    // File type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Sadece resim dosyaları yüklenebilir.' }), { status: 400 });
    }

    // File extension check
    const originalExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
      return new Response(JSON.stringify({ error: 'Desteklenmeyen dosya uzantısı.' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Additional security: Check file header for image files
    const isValidImage = checkImageHeader(buffer, file.type);
    if (!isValidImage) {
      return new Response(JSON.stringify({ error: 'Geçersiz dosya formatı.' }), { status: 400 });
    }

    // Generate safe filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedName = sanitizeFilename(path.parse(file.name).name);
    const fileName = `${timestamp}-${randomStr}-${sanitizedName}${originalExt}`;
    
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure the file path is within upload directory (prevent path traversal)
    if (!filePath.startsWith(uploadDir)) {
      return new Response(JSON.stringify({ error: 'Geçersiz dosya yolu.' }), { status: 400 });
    }

    fs.writeFileSync(filePath, new Uint8Array(buffer));

    // Public URL
    const url = `/uploads/${fileName}`;
    return new Response(JSON.stringify({ url }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Dosya yükleme hatası.' }), { status: 500 });
  }
}

// Check image file headers for additional security
function checkImageHeader(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  const header = buffer.subarray(0, 12);
  
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      return header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
    case 'image/png':
      return header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    case 'image/gif':
      return (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46);
    case 'image/webp':
      return (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) &&
             (header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50);
    default:
      return false;
  }
} 