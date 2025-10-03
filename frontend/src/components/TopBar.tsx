import { useEffect, useState } from 'react';

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
          <div className="flex space-x-4">
            <button className="bg-cta text-white px-4 py-1 rounded text-sm font-medium hover:bg-gray-600">
              SUBSCRIBE
            </button>
            <button className="bg-accent px-4 py-1 rounded text-primary hover:bg-gray-200 font-medium">
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}