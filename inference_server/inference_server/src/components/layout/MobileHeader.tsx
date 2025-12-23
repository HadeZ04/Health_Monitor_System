import React from 'react';
import { motion } from 'framer-motion';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function MobileHeader({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileHeaderProps) {
  return (
    <motion.div 
      className="fixed bg-slate-800 w-full z-50 py-4 left-0 top-0 md:hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/">
              <img 
                src="https://techxen.vercel.app/assets/img/logo/header-logo2.png" 
                alt="TechXen Logo" 
                className="max-h-full max-w-full"
              />
            </a>
          </motion.div>
          
          <motion.button
            className="text-white text-2xl flex items-center justify-center h-10 w-10 border border-white rounded"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.i 
              className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
