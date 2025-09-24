import Link from 'next/link';
import SearchBar from './SearchBar';

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

interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
}

export default function MobileMenu({ isOpen, onItemClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      {/* Mobile Header: Logo and Search */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Digno" className="h-8 w-auto" />
        </Link>
        <SearchBar onClose={onItemClick} />
      </div>
      {/* Subscribe & Login */}
      <div className="flex flex-col items-center py-4 border-b border-gray-100">
        <button className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold mb-2 w-3/4">SUBSCRIBE</button>
        <button className="text-gray-700 hover:text-black font-medium w-3/4">LOG IN</button>
      </div>
      {/* Menu Items */}
      <div className="px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item}
            href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="block py-3 text-sm font-medium text-gray-800 hover:text-blue-500 border-b border-gray-100"
            onClick={onItemClick}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}