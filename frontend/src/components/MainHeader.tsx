import Image from 'next/image';
import Link from 'next/link';

interface MainHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function MainHeader({ onMobileMenuToggle }: MainHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
  <div className="flex items-center justify-center py-4 md:justify-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={onMobileMenuToggle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
  <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Digno" 
              width={180} 
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex space-x-4">
          <button className="text-sm text-gray-700 hover:text-black font-medium" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}