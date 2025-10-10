import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBar';

interface MainHeaderProps {
  onMobileMenuToggle: () => void;
  compact?: boolean;
}

export default function MainHeader({ onMobileMenuToggle, compact = false }: MainHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 transition-all">
  <div className={`flex items-center justify-center ${compact ? 'py-2' : 'py-4'} md:justify-center transition-all`}>
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
              width={200} 
              height={200}
              className={`${compact ? 'h-16' : 'h-20'} w-auto transition-all`}
            />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex space-x-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}