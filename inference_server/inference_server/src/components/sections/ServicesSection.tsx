import React from 'react';
import { motion } from 'framer-motion';
import { heroServices } from '../../data/services';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center bg-cyan-400/10 border border-cyan-400/20 rounded-full px-6 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-cyan-400 font-semibold text-sm">
                AI-Powered Health Assistant
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span
                className="block text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                AI-Powered
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Healthcare
              </motion.span>
              <motion.span
                className="block text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Assistant
              </motion.span>
            </motion.h1>
            
            {/* Description */}
            <motion.p
              className="text-gray-300 text-xl leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Providing innovative technology solutions to help your business thrive in the digital age. 
              From cloud computing to cybersecurity, we've got you covered with cutting-edge solutions.
            </motion.p>
            
            {/* Service Tags */}
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              {heroServices.slice(0, 5).map((service, index) => (
                <motion.a
                  key={service.id}
                  href={service.href}
                  className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                    index === 2 
                      ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/25' 
                      : 'bg-white/10 text-white border border-white/20 hover:bg-lime-400 hover:text-black hover:shadow-lg hover:shadow-lime-400/25'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  {service.label}
                </motion.a>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <motion.a
                href="/services"
                className="group relative bg-lime-400 text-black font-bold px-8 py-4 rounded-full overflow-hidden shadow-xl shadow-lime-400/25 hover:shadow-2xl hover:shadow-lime-400/40 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Our Services
                  <i className="fas fa-arrow-right ml-3 transform group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
              
              <motion.a
                href="/about"
                className="group border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Learn More
                  <i className="fas fa-play ml-3 text-sm transform group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
          
      {/* Right Content - Hero Image with Rotating Earth */}
      <motion.div 
        className="relative hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative h-[700px]">
          {/* Rotating Earth Background */}
          <motion.div
            className="absolute right-20 top-10 w-96 h-96 z-5"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-sm border border-blue-400/30 relative overflow-hidden">
              {/* Earth Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://techxen.vercel.app/assets/img/bg/earth-texture.png')] bg-cover bg-center opacity-30 rounded-full"></div>
              
              {/* Continents Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.3) 0%, transparent 20%),
                    radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.2) 0%, transparent 15%),
                    radial-gradient(circle at 50% 70%, rgba(34, 197, 94, 0.25) 0%, transparent 18%),
                    radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 12%)
                  `
                }}
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Atmospheric Glow */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-xl"></div>
            </div>
          </motion.div>

          {/* Main Hero Image */}
          <motion.div
            className="absolute right-0 top-0 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <img 
              src="https://techxen.vercel.app/assets/img/hero/hero2-main-img1.png" 
              alt="Hero" 
              className="max-w-full h-auto drop-shadow-2xl relative z-10"
            />
          </motion.div>
          
          {/* Tech Grid Background */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="grid-pattern"></div>
          </div>
          
          {/* Floating Tech Elements */}
          <motion.div
            className="absolute bottom-20 right-20 z-20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl tech-glow">
              <img 
                src="https://techxen.vercel.app/assets/img/shape/hero2-shape1.png" 
                alt="Shape" 
                className="w-16 h-16"
              />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-32 right-32 z-20"
            whileHover={{ scale: 1.1 }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <a href="/services" className="block">
              <div className="bg-lime-400 rounded-full p-4 shadow-xl shadow-lime-400/25 hover:shadow-2xl hover:shadow-lime-400/40 transition-all duration-300 tech-pulse">
                <img 
                  src="https://techxen.vercel.app/assets/img/shape/hero2-shape2.png" 
                  alt="Service Link" 
                  className="w-12 h-12"
                />
              </div>
            </a>
          </motion.div>
          
          {/* Tech Particles */}
          <motion.div
            className="absolute top-20 right-10 w-4 h-4 bg-lime-400 rounded-full tech-particle"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-40 right-5 w-3 h-3 bg-blue-400 rounded-full tech-particle"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Additional Tech Orbs */}
          <motion.div
            className="absolute top-60 right-8 w-2 h-2 bg-purple-400 rounded-full tech-particle"
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          <motion.div
            className="absolute top-80 right-16 w-3 h-3 bg-cyan-400 rounded-full tech-particle"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
          />
        </div>
      </motion.div>
        </div>
      </div>
      
      {/* Bottom Right Floating Image */}
      <motion.div 
        className="absolute bottom-0 right-0 hidden lg:block z-5"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.img 
          src="https://techxen.vercel.app/assets/img/hero/hero2-main-img2.png" 
          alt="Secondary Hero" 
          className="transform scale-75 opacity-80"
          animate={{ 
            y: [0, -25, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Enhanced Scroll Indicator with Circle Effect */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative">
          {/* Outer Circle with Rotating Border */}
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {/* Animated Border Segments */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-lime-400 border-r-lime-400"></div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Circle with Arrow */}
            <motion.div
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(163, 230, 53, 0.3)",
                  "0 0 30px rgba(163, 230, 53, 0.5)",
                  "0 0 20px rgba(163, 230, 53, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.i 
                className="fas fa-arrow-down text-white text-sm"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Pulsing Dots */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-1 bg-lime-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-blue-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1 h-1 bg-purple-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 w-1 h-1 bg-cyan-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>
          
          {/* Scroll Text */}
          <motion.p
            className="text-white/70 text-xs mt-3 text-center font-medium tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SCROLL DOWN
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
