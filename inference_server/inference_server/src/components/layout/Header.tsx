import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { navigationItems } from '../../data/navigation';

interface HeaderProps {
  isScrolled: boolean;
}

export default function Header({ isScrolled }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-800' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hidden md:block py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center max-w-[130px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <a href="/" className="relative z-10">
                <img 
                  src="https://techxen.vercel.app/assets/img/logo/header-logo2.png" 
                  alt="TechXen Logo" 
                  className="max-h-full max-w-full"
                />
              </a>
            </motion.div>
            
            {/* Navigation */}
            <nav className="relative px-6 py-1">
              <ul className="flex items-center space-x-8">
                {navigationItems.map((item, index) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a 
                      href={item.href} 
                      className="text-white hover:text-lime-400 transition-colors duration-300 relative group"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white hover:text-lime-400 transition-colors duration-300"
                >
                  <i className="fas fa-search"></i>
                </button>
                
                {/* Search Overlay */}
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-0 left-0 w-full h-96 bg-white z-50 flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-2xl">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-6 py-4 text-xl border-b-2 border-gray-300 focus:border-lime-400 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => setSearchOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                      >
                        <i className="fas fa-times text-xl"></i>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* CTA Button */}
              <motion.a 
                href="#auth-login" 
                className="relative bg-lime-400 text-black font-bold px-6 py-4 rounded-full hover:bg-lime-500 transition-all duration-300 overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Secure Login 
                  <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-lime-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
