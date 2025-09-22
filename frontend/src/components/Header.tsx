'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200">
      <TopBar />
      <MainHeader onMobileMenuToggle={handleMobileMenuToggle} />
      <DesktopMenu />
      <MobileMenu isOpen={isMenuOpen} onItemClick={handleMobileMenuClose} />
    </header>
  );
}