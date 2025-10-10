'use client';

import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
      <TopBar />
      <MainHeader onMobileMenuToggle={handleMobileMenuToggle} compact={scrolled} />
      <DesktopMenu />
      <MobileMenu isOpen={isMenuOpen} onItemClick={handleMobileMenuClose} />
    </header>
  );
}