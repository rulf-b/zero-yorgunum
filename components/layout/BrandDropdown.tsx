'use client';

import Link from 'next/link';
import Image from 'next/image';

const allBrands = [
  { name: 'Samsung', href: '/markalar/samsung', logo: '/marka_logo/samsung.png' },
  { name: 'LG', href: '/markalar/lg', logo: '/marka_logo/1753122788887-ogkegf.png' },
  { name: 'Sony', href: '/markalar/sony', logo: '/marka_logo/sony.png' },
  { name: 'Vestel', href: '/markalar/vestel', logo: '/marka_logo/vestel.png' },
  { name: 'TCL', href: '/markalar/tcl', logo: '/marka_logo/tcl.png' },
  { name: 'Philips', href: '/markalar/philips', logo: '/marka_logo/philips.png' },
  { name: 'Panasonic', href: '/markalar/panasonic', logo: '/marka_logo/panasonic.png' },
  { name: 'Hisense', href: '/markalar/hisense', logo: '/marka_logo/hisense.png' },
  { name: 'Arçelik', href: '/markalar/arcelik', logo: '/marka_logo/1753123175619-qqtaj0.png' },
  { name: 'Beko', href: '/markalar/beko', logo: '/marka_logo/beko.png' },
  { name: 'Grundig', href: '/markalar/grundig', logo: '/marka_logo/1753123626318-nukdru.png' },
  { name: 'Finlux', href: '/markalar/finlux', logo: '/marka_logo/1753123961434-yjapbf.png' },
  { name: 'Profilo', href: '/markalar/profilo', logo: '/marka_logo/1753124288707-bbwgf7.png' },
  { name: 'Regal', href: '/markalar/regal', logo: '/marka_logo/1753124368642-8d5p61.png' },
  { name: 'Telefunken', href: '/markalar/telefunken', logo: '/marka_logo/1753124566301-iw8s7q.png' },
  { name: 'Toshiba', href: '/markalar/toshiba', logo: '/marka_logo/1753123224001-ehy807.png' },
  { name: 'Xiaomi', href: '/markalar/xiaomi', logo: '/marka_logo/1753124652995-hp9jui.png' },
  { name: 'Sunny', href: '/markalar/sunny', logo: '/marka_logo/1753123540532-fgm7tm.png' },
  { name: 'Hi-Level', href: '/markalar/hi-level', logo: '/marka_logo/1753123988860-2tfu91.png' },
  { name: 'Axen', href: '/markalar/axen', logo: '/marka_logo/1753123715933-q4xrn7.png' },
  { name: 'Next', href: '/markalar/next', logo: '/marka_logo/next.png' },
  { name: 'Awox', href: '/markalar/awox', logo: '/marka_logo/1753123263048-ymdfsc.jpg' },
  { name: 'Botech', href: '/markalar/botech', logo: '/marka_logo/1753123769323-ra61xg.png' },
  { name: 'JVC', href: '/markalar/jvc', logo: '/marka_logo/1753124036533-feb003.png' },
];

export default function BrandDropdown({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border py-4 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">Tüm TV Markalarımız</h3>
      </div>
      <div className="grid grid-cols-3 gap-1 px-4">
        {allBrands.map((brand) => (
          <Link
            key={brand.href}
            href={brand.href}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors text-xs"
            onClick={onSelect}
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={18}
              height={18}
              loading="lazy"
              style={{ height: 'auto' }}
            />
            <span className="font-medium text-gray-700">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}


