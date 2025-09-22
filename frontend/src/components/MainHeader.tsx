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
          <button className="text-sm text-gray-700 hover:text-black font-medium">
            🔍
          </button>
        </div>
      </div>
    </div>
  );
}