'use client';

import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 relative">
              <Image
                src="/swinghighplain.jpg"
                alt="Swing High Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline">SwingHigh</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-black hover:text-primary-600 transition-colors duration-200">
              Home
            </Link>
            <Link href="/products" className="text-black hover:text-primary-600 transition-colors duration-200">
              Products
            </Link>
            <Link href="/about" className="text-black hover:text-primary-600 transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-black hover:text-primary-600 transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-black hover:text-primary-600 transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-black hover:text-primary-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-black hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-black hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-black hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-black hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 