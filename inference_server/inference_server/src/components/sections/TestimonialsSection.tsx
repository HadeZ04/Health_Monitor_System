import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'David Johnson',
    position: 'CEO, TechCorp Solutions',
    image: 'https://techxen.vercel.app/assets/img/testimonial/testimonial1.jpg',
    content: 'TechXen transformed our entire IT infrastructure. Their cloud migration services helped us reduce costs by 40% while improving performance significantly.',
    rating: 5,
    company: 'TechCorp Solutions'
  },
  {
    id: 2,
    name: 'Lisa Thompson',
    position: 'CTO, InnovateLab',
    image: 'https://techxen.vercel.app/assets/img/testimonial/testimonial2.jpg',
    content: 'Outstanding cybersecurity implementation. TechXen\'s team identified vulnerabilities we didn\'t even know existed and provided comprehensive solutions.',
    rating: 5,
    company: 'InnovateLab'
  },
  {
    id: 3,
    name: 'Robert Martinez',
    position: 'Director, DataFlow Inc',
    image: 'https://techxen.vercel.app/assets/img/testimonial/testimonial3.jpg',
    content: 'The data analytics platform they built for us has revolutionized our decision-making process. Highly recommend their services.',
    rating: 5,
    company: 'DataFlow Inc'
  }
];

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="text-lime-400 font-bold inline-flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://techxen.vercel.app/assets/img/icon/span2.png" 
              alt="" 
              className="mr-2 -mt-1"
            />
            Testimonials
          </motion.span>
          
          <motion.h2 
            className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            What Our Clients
            <br />
            <span className="text-lime-400">Say About Us</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Don't just take our word for it. Here's what our satisfied clients 
            have to say about our services and solutions.
          </motion.p>
        </motion.div>
        
        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-slate-700"
            >
              <div className="text-center">
                {/* Quote Icon */}
                <motion.div 
                  className="mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <i className="fas fa-quote-left text-lime-400 text-4xl"></i>
                </motion.div>
                
                {/* Content */}
                <motion.p 
                  className="text-white text-xl lg:text-2xl leading-relaxed mb-8 italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  "{testimonials[currentTestimonial].content}"
                </motion.p>
                
                {/* Rating */}
                <motion.div 
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, index) => (
                    <motion.i
                      key={index}
                      className="fas fa-star text-lime-400 text-xl mx-1"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    />
                  ))}
                </motion.div>
                
                {/* Author */}
                <motion.div 
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-lime-400">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-lg">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-lime-400 font-semibold">
                      {testimonials[currentTestimonial].position}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-slate-700 hover:bg-lime-400 text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-chevron-left"></i>
            </motion.button>
            
            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-lime-400 w-8' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-slate-700 hover:bg-lime-400 text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>
        </div>
        
        {/* Client Logos */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-gray-400 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {[1, 2, 3, 4, 5].map((logo, index) => (
              <motion.div
                key={logo}
                className="grayscale hover:grayscale-0 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <img 
                  src={`https://techxen.vercel.app/assets/img/client/client${logo}.png`} 
                  alt={`Client ${logo}`}
                  className="h-12 w-auto"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
