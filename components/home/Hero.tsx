'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Shield, Clock, Users, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { useCounter } from '@/hooks/use-counter';

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  const siteSettings = useSiteSettings() as any;

  // Slider images default (depend on heroData if present)
  const sliderImages = (heroData?.sliderImages && Array.isArray(heroData.sliderImages) && heroData.sliderImages.length > 0
    ? heroData.sliderImages
    : [
        '/screens/1.jpeg',
        '/screens/2.jpeg',
        '/screens/3.jpeg',
        '/screens/5.jpeg',
      ]).slice(0, 4);

  const sliderHostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIsLoaded(true);
    let interval: any;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % sliderImages.length);
      }, 3000);
    };
    // Başlatmayı görünürlük ve idle'a göre geciktir
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if ('requestIdleCallback' in window) {
            // @ts-ignore
            (window as any).requestIdleCallback(start, { timeout: 1000 });
          } else {
            setTimeout(start, 200);
          }
        }
      });
    }, { threshold: 0.1 });
    if (sliderHostRef.current) obs.observe(sliderHostRef.current);

    const handleVisibility = () => {
      if (document.hidden && interval) {
        clearInterval(interval);
        interval = null;
        started = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      obs.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [sliderImages.length]);

  useEffect(() => {
    if (!siteSettings) return;
    setHeroData(siteSettings.homepageHero || null);
  }, [siteSettings]);

  // Defaults if not set
  const title = heroData?.title || 'İstanbul TV Ekran Tamiri ve Değişimi';
  const subtitle = heroData?.subtitle || 'İstanbul genelinde uzman TV ekran değişimi, LED panel tamiri ve anakart hizmetleri. Samsung, LG, Sony, Vestel tüm markalar için aynı gün servis.';
  const stats = heroData?.stats || { years: 10, yearsLabel: 'Yıl Deneyim', repairedTVs: 5000, repairedTVsLabel: 'Onarılan TV', support: '7/24', supportLabel: 'Destek' };

  // Animated counters
  const yearsCount = useCounter({ end: stats.years, start: 0, duration: 2500, delay: 500 });
  const tvsCount = useCounter({ end: stats.repairedTVs, start: 0, duration: 4000, delay: 800 });

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}> 
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              {title.split(' ').map((word: string, i: number) =>
                ['ekran', 'tamiri'].includes(word.toLowerCase()) ? (
                  <span key={i} className="text-blue-600">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {subtitle}
            </p>
            {/* Stats with animated counters */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div 
                className="text-center animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-2xl font-bold text-blue-600 hover-glow">{yearsCount}+</div>
                <div className="text-sm text-gray-600">{stats.yearsLabel}</div>
              </div>
              <div 
                className="text-center animate-scale-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="text-2xl font-bold text-blue-600 hover-glow">{tvsCount.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">{stats.repairedTVsLabel}</div>
              </div>
              <div 
                className="text-center animate-scale-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="text-2xl font-bold text-blue-600 hover-glow">{stats.support}</div>
                <div className="text-sm text-gray-600">{stats.supportLabel}</div>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg hover-lift animate-pulse-slow"
                onClick={() => {
                  const el = document.getElementById('quote-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Anında Fiyat Teklifi Alın
              </Button>
              <a href={`tel:${siteSettings?.phone?.replace(/\s/g, '') || '+905525587905'}`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg hover-lift"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Hemen Ara
                </Button>
              </a>
            </div>
          </div>
          {/* Image Slider with enhanced animations */}
          <div ref={sliderHostRef} className={`relative animate-slide-in-right lg:-mt-32`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 w-full">
              {sliderImages.map((src: string, idx: number) => (
                <div key={src} className="absolute inset-0">
                  <Image
                    src={src}
                    alt={`Ekran değişimi görseli ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={idx === 0}
                    className={`object-cover transition-all duration-1000 ${
                      current === idx ? 'opacity-100 z-10 scale-105' : 'opacity-0 z-0 scale-100'
                    }`}
                  />
                </div>
              ))}
            </div>
            {/* Enhanced Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {sliderImages.map((_: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ${
                    current === idx 
                      ? 'bg-blue-600 scale-125 shadow-lg' 
                      : 'bg-white/70 border border-blue-300 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
