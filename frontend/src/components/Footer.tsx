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
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image 
              src="/logo.png" 
              alt="Digno" 
              width={60} 
              height={60}
              className="mb-4 brightness-0 invert"
              style={{ maxWidth: '80px', width: '100%', height: 'auto' }}
              priority
            />
            <p className="text-gray-400 text-sm">
              Independent journalism for the modern world.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-cta">Sections</h3>
            <ul className="space-y-2 text-sm">
              {menuItems.slice(0, 4).map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-cta">More</h3>
            <ul className="space-y-2 text-sm">
              {menuItems.slice(4).map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-cta">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">Subscribe</Link></li>
              <li><Link href="#" className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">Donate</Link></li>
              <li><Link href="#" className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">Contact</Link></li>
              <li><Link href="/about" className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">About</Link></li>
              <li><Link href="/privacy" className="text-[color:#f8fbff] hover:text-white hover:font-bold transition-colors uppercase">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary mt-8 pt-8 text-center text-sm text-cta">
          <p>&copy; 2025 Digno News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}