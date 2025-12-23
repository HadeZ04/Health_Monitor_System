import React from 'react';
import { motion } from 'framer-motion';
import { footerServices, footerLinks, footerContactInfo, footerSocialLinks } from '../../data/footer';

export default function Footer() {
  return (
    <footer className="relative pt-20 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <a href="/">
                <img 
                  src="https://techxen.vercel.app/assets/img/logo/header-logo2.png" 
                  alt="TechXen Logo" 
                  className="max-h-12"
                />
              </a>
            </motion.div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              What Is IoT in Healthcare?
              The Internet of Things (IoT) in healthcare refers to the integration of internet-connected devices and sensors throughout the medical field. 
              These devices collect, transmit, and sometimes analyze health data for patients, clinicians, and facilities, a process also known as deep learning in healthcare.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {footerSocialLinks.map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-lime-400 hover:text-black transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <i className="fab fa-facebook-f"></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-bold mb-6">Services We Offer</h3>
            <ul className="space-y-3">
              {footerServices.map((service, index) => (
                <motion.li 
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a 
                    href={service.href} 
                    className="text-gray-300 hover:text-lime-400 transition-colors duration-300 flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-xs mr-2 transform group-hover:translate-x-1 transition-transform duration-300"></i>
                    {service.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Useful Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-bold mb-6">Useful Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-lime-400 transition-colors duration-300 flex items-center group"
                  >
                    <i className="fas fa-chevron-right text-xs mr-2 transform group-hover:translate-x-1 transition-transform duration-300"></i>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              {footerContactInfo.map((contact, index) => (
                <motion.div 
                  key={contact.id}
                  className="flex items-center group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-lime-400/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-lime-400/20 transition-colors duration-300">
                    <img 
                      src={contact.icon} 
                      alt="" 
                      className="w-4 h-4 brightness-200"
                    />
                  </div>
                  <div>
                    <a 
                      href={contact.href} 
                      className="text-gray-300 hover:text-lime-400 transition-colors duration-300"
                    >
                      {contact.text}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl">
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.p 
                className="text-gray-300 mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
              </motion.p>
              
              <motion.div 
                className="flex space-x-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <a 
                  href="/terms" 
                  className="text-gray-300 hover:text-lime-400 transition-colors duration-300 relative after:content-[''] after:absolute after:right-[-12px] after:top-1/2 after:transform after:-translate-y-1/2 after:w-1 after:h-4 after:bg-gray-600"
                >
                  Terms & Conditions
                </a>
                <a 
                  href="/privacy" 
                  className="text-gray-300 hover:text-lime-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll to Top Button */}
          <motion.a
            href="#top"
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center text-black hover:bg-lime-500 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <i className="fas fa-arrow-up"></i>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
