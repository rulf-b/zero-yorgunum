"use client";

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cpu, Shield, Clock, Star, CheckCircle } from 'lucide-react';
import { usePrices } from '@/lib/PricesContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSiteSettings } from '@/lib/SiteSettingsContext';

const MotherboardRepairPage = () => {
  const { prices, loading } = usePrices();
  const siteSettings = useSiteSettings() as any;

  // siteSettings context'ten geliyor

const arizalar = [
  'TV açılmıyor',
  'Güç gelmiyor',
  'Görüntü yok',
  'Ses var görüntü yok',
  'Yazılım arızası',
  'HDMI/USB çalışmıyor',
  'Kumanda algılamıyor',
];

const process = [
  { step: 1, title: 'Ücretsiz Teşhis', description: 'Anakart ve bileşenler detaylıca incelenir.' },
  { step: 2, title: 'Fiyat Teklifi', description: 'Şeffaf fiyatlandırma, onay sonrası işleme başlanır.' },
  { step: 3, title: 'Onarım & Değişim', description: 'Arızalı bileşenler değiştirilir, anakart onarılır.' },
  { step: 4, title: 'Test & Garanti', description: 'Tüm testler yapılır, 12 ay garanti verilir.' },
];

  if (loading || !prices) return <div className="text-center py-20">Fiyatlar yükleniyor...</div>;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Anakart Tamiri</h1>
              <p className="text-xl text-gray-600 mb-8">TV'niz açılmıyor, görüntü gelmiyor veya güç sorunu mu var? Uzman ekibimiz, anakart ve elektronik bileşenlerde hızlı ve garantili onarım sağlar.</p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{prices.motherboardRepairRange}</div>
                  <div className="text-sm text-gray-600">Fiyat Aralığı</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12 Ay</div>
                  <div className="text-sm text-gray-600">Garanti</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Ücretsiz Teklif Al</Button>
                </Link>
                <a href={`tel:${siteSettings?.phone?.replace(/\s/g, '') || '+905525587905'}`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">Uzmanı Ara</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96">
                <Image
                  src="/screens/6.jpeg"
                  alt="Anakart Tamiri"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-2xl shadow-xl mb-4"
                />
              </div>
              <div className="absolute bottom-4 right-4 w-40 h-28 border-4 border-white rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/screens/7.jpeg"
                  alt="Anakart Tamiri 2"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Arızalar */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hangi Arızaları Onarıyoruz?</h2>
            <p className="text-xl text-gray-600">Tüm anakart ve elektronik arızalarda profesyonel çözüm sunuyoruz.</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg text-gray-700">
            {arizalar.map((a, i) => (
              <li key={i} className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2" />{a}</li>
            ))}
          </ul>
        </div>
      </section>
      {/* Süreç */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Onarım Süreci</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Neden Biz */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Orijinal Parça</h3>
              <p className="text-blue-100">Tüm onarımlarda orijinal veya eşdeğer kalitede anakart ve bileşenler kullanılır.</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Hızlı Servis</h3>
              <p className="text-blue-100">Çoğu anakart tamiri aynı gün içinde tamamlanır.</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">12 Ay Garanti</h3>
              <p className="text-blue-100">Tüm işlemler 12 ay garanti kapsamındadır.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Anakart Sorununuz mu Var?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Ücretsiz teşhis ve fiyat teklifi için hemen başvurun. Uzmanlarımız TV'nizi ilk günkü gibi yenilesin.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/quote">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Ücretsiz Teklif Al</Button>
            </Link>
            <a href={`tel:${siteSettings?.phone?.replace(/\s/g, '') || '+905525587905'}`}>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Ara: {siteSettings?.phone || '+90 552 558 79 05'}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotherboardRepairPage; 