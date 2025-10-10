import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setFormatted(now.toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
  <div className="hidden md:block bg-primary border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span className="text-accent">{formatted ? formatted : ''}</span>
          </div>
          <div className="flex space-x-3">
            <Link href="/subscribe" className="inline-flex items-center justify-center h-8 px-4 rounded-md bg-cta text-white hover:bg-cta-darken transition-colors text-sm font-medium">
              SUBSCRIBE
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center h-8 px-4 rounded-md border border-gray-300 bg-white text-primary hover:bg-gray-50 transition-colors text-sm font-medium">
              LOG IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}