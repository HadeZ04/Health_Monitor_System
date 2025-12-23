import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-24 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Images */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://digitalhealth.folio3.com/wp-content/uploads/2025/01/Group-1000002931-1.png" 
                  alt="About Us" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </motion.div>
              
              {/* New Image Below */}
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl mt-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://advinhealthcare.com/wp-content/uploads/2022/11/Internet-of-Things-IoT-Used-In-Heath-Care-3.jpg" 
                  alt="New Image" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </motion.div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-lime-400/20 to-green-400/20 rounded-full backdrop-blur-sm border border-lime-400/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute top-1/4 -right-6 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full backdrop-blur-sm border border-blue-400/30"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
          
          {/* Right - Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center bg-lime-400/10 border border-lime-400/20 rounded-full px-6 py-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 bg-lime-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-lime-400 font-semibold">About TechXen</span>
            </motion.div>
            
            {/* Heading */}
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              The Fusion of
              <span className="block bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                AI and IoT
              </span>
              in Healthcare
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              The Internet of Things (IoT) in healthcare refers to the integration of internet-connected devices and sensors throughout the medical field. 
              These devices collect, transmit, and sometimes analyze health data for patients, clinicians, and facilities, a process also known as deep learning in healthcare.
              It’s another example of AI in healthcare, where technology is used to improve medical care and streamline workflows.
            </motion.p>
            
            {/* Features List */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                'Data collection through IoT devices',
                'Secure transmission of health data over networks',
                'AI analysis for insights and early warnings',
                'Action or recommendations sent to medical staff'
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-lime-400 to-green-400 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { number: '500+', label: 'Projects Completed' },
                { number: '98%', label: 'Client Satisfaction' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center lg:text-left group"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </h4>
                  <p className="text-gray-300 font-semibold">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="/about"
                className="group inline-flex items-center bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold px-8 py-4 rounded-full shadow-xl shadow-lime-400/25 hover:shadow-2xl hover:shadow-lime-400/40 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
                <i className="fas fa-arrow-right ml-3 transform group-hover:translate-x-1 transition-transform duration-300"></i>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
