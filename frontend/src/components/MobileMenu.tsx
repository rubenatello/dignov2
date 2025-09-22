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

interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
}

export default function MobileMenu({ isOpen, onItemClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item}
            href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="block py-3 text-sm font-medium text-gray-800 hover:text-black border-b border-gray-100"
            onClick={onItemClick}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}