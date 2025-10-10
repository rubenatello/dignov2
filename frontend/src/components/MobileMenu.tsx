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
    <div className="md:hidden bg-white border-t border-gray-200 rounded-lg shadow-lg max-w-full mx-auto mt-2">
      {/* Mobile Header: Search full width */}
      <div className="px-4 py-3 border-b border-gray-100">
        <SearchBar onClose={onItemClick} />
      </div>
      {/* Actions */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/subscribe" className="inline-flex items-center justify-center h-10 rounded-md bg-cta text-white hover:bg-cta-darken transition-colors text-sm font-medium text-center">SUBSCRIBE</Link>
          <Link href="/login" className="inline-flex items-center justify-center h-10 rounded-md border border-gray-300 bg-white text-primary hover:bg-gray-50 transition-colors text-sm font-medium text-center">LOG IN</Link>
        </div>
      </div>
      {/* Menu Items */}
      <div className="px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item}
            href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
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