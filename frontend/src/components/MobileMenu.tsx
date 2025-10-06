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
      {/* Mobile Header: Search, Subscribe, Login on one row evenly spaced */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-2">
        <div className="flex-1 flex justify-center">
          <div className="w-full flex justify-center">
            <SearchBar onClose={onItemClick} />
          </div>
        </div>
        <button className="bg-cta text-white px-4 py-2 rounded text-sm font-semibold flex-1 mx-2">SUBSCRIBE</button>
        <button className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded text-sm flex-1 mx-2">LOG IN</button>
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