import React from 'react';
import { motion } from 'framer-motion';
import { heroServices } from '../../data/services';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Ultra Professional Background */}
      <div className="absolute inset-0">
        {/* Primary Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Medical Grid Overlay */}
        <div className="absolute inset-0 medical-professional-grid opacity-20"></div>
        
        {/* Floating Medical Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Professional Light Rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent transform -skew-y-12 translate-y-1/2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent transform skew-y-12 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-screen">
          
          {/* Health Monitoring Dashboard */}
          <motion.div 
            className="lg:col-span-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl medical-dashboard">
              {/* Dashboard Header */}
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-white font-bold text-xl flex items-center">
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full mr-3"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Health Monitor
                </h3>
                <div className="text-xs text-green-400 font-semibold bg-green-400/10 px-3 py-1 rounded-full">
                  LIVE
                </div>
              </motion.div>
              
              {/* Vital Signs Grid */}
              <div className="space-y-4">
                {/* Heart Rate */}
                <motion.div 
                  className="group relative bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl p-4 border border-red-500/20 hover:border-red-400/40 transition-all duration-500 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <motion.div
                        className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <i className="fas fa-heartbeat text-red-400 text-lg"></i>
                      </motion.div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Heart Rate</p>
                        <p className="text-xs text-gray-400">Cardiac Monitor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.div 
                        className="text-red-400 font-bold text-2xl"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        72
                      </motion.div>
                      <div className="text-green-400 text-xs font-semibold">BPM â€¢ Normal</div>
                    </div>
                  </div>
                  {/* ECG Line Animation */}
                  <div className="mt-3 h-8 relative overflow-hidden rounded-lg bg-black/20">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/50 to-transparent"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>

                {/* SpO2 */}
                <motion.div 
                  className="group relative bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-lungs text-blue-400 text-lg"></i>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">SpO2</p>
                        <p className="text-xs text-gray-400">Oxygen Saturation</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold text-2xl">98%</div>
                      <div className="text-green-400 text-xs font-semibold">Excellent</div>
                    </div>
                  </div>
                  {/* Oxygen Wave */}
                  <div className="mt-3 h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                      animate={{ width: ["0%", "98%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                </motion.div>

                {/* Blood Pressure */}
                <motion.div 
                  className="group relative bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-tint text-purple-400 text-lg"></i>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Blood Pressure</p>
                        <p className="text-xs text-gray-400">Systolic/Diastolic</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold text-xl">120/80</div>
                      <div className="text-green-400 text-xs font-semibold">mmHg â€¢ Optimal</div>
                    </div>
                  </div>
                </motion.div>

                {/* Blood Sugar */}
                <motion.div 
                  className="group relative bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-500 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-vial text-orange-400 text-lg"></i>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">Blood Sugar</p>
                        <p className="text-xs text-gray-400">Glucose Level</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-bold text-xl">95</div>
                      <div className="text-green-400 text-xs font-semibold">mg/dL â€¢ Normal</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Health Status */}
              <motion.div 
                className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 relative overflow-hidden"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(34, 197, 94, 0.2)",
                    "0 0 50px rgba(34, 197, 94, 0.4)",
                    "0 0 30px rgba(34, 197, 94, 0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
                <div className="relative flex items-center justify-center">
                  <motion.i 
                    className="fas fa-shield-alt text-green-400 text-2xl mr-3"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">All Systems Optimal</div>
                    <div className="text-green-300 text-xs">Health Status: Excellent</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-6 order-1 lg:order-2 space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Premium Badge */}
            <motion.div 
              className="inline-flex items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-full px-8 py-4 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-3 h-3 bg-cyan-400 rounded-full mr-4"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-cyan-400 font-semibold text-lg">
                AI-Powered Health Assistant
              </span>
              <div className="ml-4 px-3 py-1 bg-cyan-400/20 rounded-full">
                <span className="text-cyan-300 text-xs font-bold">PREMIUM</span>
              </div>
            </motion.div>
            
            {/* Hero Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-black leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <motion.span
                className="block text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your Personal
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                AI Doctor
              </motion.span>
              <motion.span
                className="block text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                24/7 Care
              </motion.span>
            </motion.h1>
            
            {/* Premium Description */}
            <motion.p
              className="text-gray-300 text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Experience the future of healthcare with our advanced AI system. Real-time vital monitoring, 
              instant diagnosis, personalized treatment plans, and 24/7 medical assistance powered by 
              cutting-edge machine learning algorithms.
            </motion.p>
            
            {/* Medical Services Tags */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              {heroServices.slice(0, 4).map((service, index) => (
                <motion.a
                  key={service.id}
                  href={service.href}
                  className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-500 overflow-hidden ${
                    index === 1 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-black shadow-xl shadow-cyan-400/25' 
                      : 'bg-white/10 text-white border border-white/20 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400 hover:text-black hover:shadow-xl hover:shadow-cyan-400/25'
                  }`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <span className="relative z-10">{service.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.a>
              ))}
            </motion.div>
            
            {/* Premium CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <motion.a
                href="/consultation"
                className="group relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-black font-bold px-10 py-5 rounded-full overflow-hidden shadow-2xl shadow-cyan-400/30 hover:shadow-3xl hover:shadow-cyan-400/50 transition-all duration-500"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center text-lg">
                  Start AI Consultation
                  <motion.i 
                    className="fas fa-robot ml-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.a>
              
              <motion.a
                href="/demo"
                className="group relative border-2 border-white/30 text-white font-bold px-10 py-5 rounded-full hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center text-lg">
                  Watch Demo
                  <motion.i 
                    className="fas fa-play ml-3"
                    whileHover={{ scale: 1.2 }}
                  />
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* 3D Medical Earth */}
          <motion.div 
            className="lg:col-span-3 order-3 relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative h-[600px] flex items-center justify-center">
              {/* 3D Earth with Medical Network */}
              <motion.div
                className="relative w-80 h-80"
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                {/* Orbital Medical Crosses */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotateZ: 360 }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Medical Cross Orbit Ring */}
                  <div className="absolute inset-0 rounded-full border border-red-500/20"></div>
                  <div className="absolute inset-4 rounded-full border border-red-500/15"></div>
                  
                  {/* Orbiting Medical Symbols */}
                  {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl shadow-red-500/50"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 0',
                      }}
                      animate={{ 
                        rotate: [angle, angle + 360],
                        y: [0, -8, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        y: {
                          duration: 2 + index * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        },
                        scale: {
                          duration: 3 + index * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      initial={{
                        x: Math.cos((angle * Math.PI) / 180) * 160,
                        y: Math.sin((angle * Math.PI) / 180) * 160,
                      }}
                    >
                      <div className="relative">
                        <div className="w-7 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-7 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* 3D Earth Globe */}
                <motion.div
                  className="w-full h-full rounded-full relative"
                  style={{ 
                    transformStyle: "preserve-3d"
                  }}
                  animate={{ 
                    rotateY: 360,
                    rotateX: [0, 15, 0, -15, 0]
                  }}
                  transition={{ 
                    rotateY: {
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    rotateX: {
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {/* Earth Sphere */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600/60 to-green-600/60 backdrop-blur-sm border-2 border-cyan-400/40 relative overflow-hidden shadow-2xl">
                    {/* Continents */}
                    <div className="absolute inset-0 rounded-full opacity-80">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `
                            radial-gradient(ellipse at 25% 35%, rgba(34, 197, 94, 0.7) 0%, transparent 35%),
                            radial-gradient(ellipse at 75% 25%, rgba(34, 197, 94, 0.6) 0%, transparent 30%),
                            radial-gradient(ellipse at 60% 70%, rgba(34, 197, 94, 0.65) 0%, transparent 40%),
                            radial-gradient(ellipse at 15% 75%, rgba(34, 197, 94, 0.55) 0%, transparent 25%)
                          `
                        }}
                        animate={{ rotate: -360 }}
                        transition={{ 
                          duration: 35,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      {/* Medical Network Grid */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `
                            conic-gradient(from 0deg, 
                              transparent 0deg, 
                              rgba(239, 68, 68, 0.4) 20deg, 
                              transparent 40deg,
                              rgba(6, 182, 212, 0.4) 60deg,
                              transparent 80deg,
                              rgba(239, 68, 68, 0.4) 100deg,
                              transparent 120deg,
                              rgba(6, 182, 212, 0.4) 140deg,
                              transparent 160deg,
                              rgba(239, 68, 68, 0.4) 180deg,
                              transparent 200deg,
                              rgba(6, 182, 212, 0.4) 220deg,
                              transparent 240deg,
                              rgba(239, 68, 68, 0.4) 260deg,
                              transparent 280deg,
                              rgba(6, 182, 212, 0.4) 300deg,
                              transparent 320deg,
                              rgba(239, 68, 68, 0.4) 340deg,
                              transparent 360deg
                            )
                          `
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 40,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                    
                    {/* Medical Pulse Rings */}
                    {[0, 1, 2].map((ring, index) => (
                      <motion.div
                        key={ring}
                        className={`absolute inset-${ring * 2} rounded-full border-2 ${
                          index === 0 ? 'border-red-400/50' : 
                          index === 1 ? 'border-cyan-400/40' : 'border-green-400/30'
                        }`}
                        animate={{ 
                          scale: [1, 1.2 + index * 0.1, 1],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{ 
                          duration: 2 + index,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Enhanced Atmospheric Layers */}
                  <div className="absolute -inset-12 rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-green-400/30 blur-3xl"></div>
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-red-400/20 via-cyan-400/20 to-blue-400/20 blur-2xl"></div>
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-400/15 via-red-400/15 to-cyan-400/15 blur-xl"></div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Ultra Premium Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* Outer Rotating Ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {/* Gradient Border Segments */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400"></div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Circle */}
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 shadow-xl"
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(6, 182, 212, 0.3)",
                  "0 0 50px rgba(6, 182, 212, 0.6)",
                  "0 0 30px rgba(6, 182, 212, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.i 
                className="fas fa-chevron-down text-white text-lg"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Orbital Dots */}
            {[0, 90, 180, 270].map((angle, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                initial={{
                  x: Math.cos((angle * Math.PI) / 180) * 35,
                  y: Math.sin((angle * Math.PI) / 180) * 35,
                }}
              />
            ))}
          </motion.div>
          
          {/* Premium Text */}
          <motion.p
            className="text-white/80 text-sm mt-4 text-center font-medium tracking-widest"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            EXPLORE MORE
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
