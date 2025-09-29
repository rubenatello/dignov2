import Image from 'next/image';
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

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image 
              src="/logo.png" 
              alt="Digno" 
              width={120} 
              height={40}
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              Independent journalism for the modern world.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-white">Sections</h3>
            <ul className="space-y-2 text-sm">
              {menuItems.slice(0, 4).map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-200 hover:text-white hover:font-bold transition-colors uppercase">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-gray-300">More</h3>
            <ul className="space-y-2 text-sm">
              {menuItems.slice(4).map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-200 hover:text-white hover:font-bold transition-colors uppercase">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-gray-300">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-200 hover:text-white hover:font-bold transition-colors uppercase">Subscribe</Link></li>
              <li><Link href="#" className="text-gray-200 hover:text-white hover:font-bold transition-colors uppercase">Donate</Link></li>
              <li><Link href="#" className="text-gray-200 hover:text-white hover:font-bold transition-colors uppercase">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Digno News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}