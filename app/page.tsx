import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
const QuoteSection = dynamic(() => import('@/components/home/QuoteSection'), { ssr: false, loading: () => <div className="py-16 text-center">Yükleniyor...</div> });
import { promises as fs } from 'fs';
import path from 'path';
import ClientOnVisible from '@/components/ClientOnVisible';

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  ssr: false,
  loading: () => <div className="py-20 text-center">Yükleniyor...</div>,
});

const BlogPreview = dynamic(() => import('@/components/home/BlogPreview'), {
  ssr: false,
  loading: () => <div className="py-20 text-center">Yükleniyor...</div>,
});
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Ekran Tamiri İstanbul | Ekran Değişimi & LED Panel Tamiri - Zero Teknik',
  description: 'İstanbul genelinde profesyonel TV ekran tamiri ve değişimi. Samsung, LG, Sony, Vestel tüm markalar. Aynı gün servis, 12 ay garanti. Ücretsiz teklif alın!',
  keywords: 'tv ekran tamiri istanbul, tv ekran değişimi, led panel tamiri, samsung tv tamiri, lg ekran tamiri, tv tamiri istanbul',
  openGraph: {
    title: 'Ekran Sitesi - Profesyonel Ekran Çözümleri',
    description: 'Profesyonel ekran çözümleri ve LED ekranlar için güvenilir hizmet.',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ekran Sitesi - Profesyonel Ekran Çözümleri',
    description: 'Profesyonel ekran çözümleri ve LED ekranlar için güvenilir hizmet.',
  },
};

async function getBrandsServer() {
  try {
    const fp = path.join(process.cwd(), 'data', 'brands.json');
    const json = await fs.readFile(fp, 'utf-8');
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map((b: any) => b.name) : [];
  } catch {
    return [];
  }
}

export const revalidate = 1800;

export default async function Home() {
  const initialBrands = await getBrandsServer();
  return (
    <div className="pt-16">
      <Hero />
      <Services />
      {/* Markaları serverdan geçirerek ilk boyamada extra ağ çağrısını önlüyoruz */}
      <QuoteSection initialBrands={initialBrands} />
      <ClientOnVisible>
        <Testimonials />
      </ClientOnVisible>
      <ClientOnVisible>
        <BlogPreview />
      </ClientOnVisible>
    </div>
  );
}