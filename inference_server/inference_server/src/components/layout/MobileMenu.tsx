import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileMenuItems, contactInfo, socialLinks } from '../../data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bg-slate-900 h-full w-full z-40 px-8 py-20 overflow-y-auto md:hidden"
        >
          <div className="space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <a href="/">
                <img 
                  src="https://techxen.vercel.app/assets/img/logo/header-logo2.png" 
                  alt="TechXen Logo" 
                  className="max-h-full max-w-full"
                />
              </a>
            </motion.div>
            
            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ul className="space-y-4">
                {mobileMenuItems.map((item, index) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <a 
                      href={item.href} 
                      className="text-white text-lg block py-2 hover:text-lime-400 transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a 
                href="#auth-login" 
                className="bg-lime-400 text-black font-bold px-6 py-4 rounded-full inline-block w-full text-center hover:bg-lime-500 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Đăng nhập <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-white text-2xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.div 
                    key={contact.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="mr-4">
                      <img src={contact.icon} alt="" className="brightness-200" />
                    </div>
                    <div>
                      <a 
                        href={contact.href} 
                        className="text-white hover:text-lime-400 transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        {contact.text}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-white text-2xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.id}
                    href={social.href}
                    className="text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
