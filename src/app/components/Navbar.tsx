'use client';

import { useState } from 'react';
import { Menu, X, MoreHorizontal, Moon } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="text-blue-600">koin</span>
              <span className="text-gray-900">bx</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Market
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Trade
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Trade Contest
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Fees
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Earn
            </a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Moon size={20} />
            </button>
            <button className="text-gray-700 hover:text-gray-900 px-4 py-2 font-medium transition-colors">
              Login
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg mt-2 p-4 shadow-lg border border-gray-100">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Market
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Trade
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Trade Contest
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Fees
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Earn
              </a>
              <hr className="border-gray-100 my-2" />
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium text-left">
                Login
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
