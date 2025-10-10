import Link from 'next/link';
import type React from 'react';

const menuItems = [
  'BREAKING NEWS',
  'ECONOMY', 
  'POLITICS',
  'FOREIGN AFFAIRS',
  'IMMIGRATION',
  'HUMAN RIGHTS',
  'LEGISLATION',
  'OPINION'
];

export default function DesktopMenu() {
  return (
    <nav className="hidden md:block border-t border-gray-200">
      <div className="flex justify-center space-x-8 py-3">
        {menuItems.map((item) => (
          <Link 
            key={item}
            href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm font-medium text-gray-800 hover:text-gray-500 py-2 px-1 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            style={{ textDecoration: 'none', position: 'relative' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = '#424242ff'; // Tailwind blue-400
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = '';
            }}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}