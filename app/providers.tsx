'use client';

import { PricesProvider } from '@/lib/PricesContext';
import type { SitePrices } from '@/lib/sitePrices';

export default function Providers({ children, initialPrices }: { children: React.ReactNode; initialPrices?: SitePrices | null }) {
  return <PricesProvider initialPrices={initialPrices ?? null as any}>{children}</PricesProvider>;
}



