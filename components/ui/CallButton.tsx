'use client';

import { useEffect, useState } from 'react';

export default function CallButton() {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/site-settings`)
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(() => {});
  }, []);

  const handleCallClick = () => {
    const phoneNumber = siteSettings?.phone?.replace(/\s/g, '') || '+905525587905';
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <button
      onClick={handleCallClick}
      className="fixed bottom-24 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-float"
      aria-label="Bizi arayın"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"/></svg>
    </button>
  );
}


