import Link from 'next/link';

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
            href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm font-medium text-gray-800 hover:text-blue-500 py-2 px-1 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            style={{ textDecoration: 'none', position: 'relative' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#60a5fa'; // Tailwind blue-400
            }}
            onMouseLeave={e => {
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