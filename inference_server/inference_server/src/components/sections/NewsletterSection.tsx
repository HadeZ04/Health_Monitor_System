import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-20 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
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
              Newsletter
            </motion.span>
            
            <motion.h2 
              className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Stay Updated with
              <br />
              <span className="text-lime-400">Latest Tech Insights</span>
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter and get the latest technology trends, 
              industry insights, and exclusive updates delivered straight to your inbox.
            </motion.p>
          </motion.div>
          
          {/* Newsletter Form */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col md:flex-row gap-4">
                    <motion.div 
                      className="flex-1"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-full px-6 py-4 focus:border-lime-400 focus:outline-none transition-colors duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </motion.div>
                    
                    <motion.button 
                      type="submit" 
                      className="bg-lime-400 text-black font-bold px-8 py-4 rounded-full hover:bg-lime-500 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Subscribe
                      <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                  </p>
                </form>
              ) : (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <i className="fas fa-check-circle text-lime-400 text-6xl mb-4"></i>
                  </motion.div>
                  <h3 className="text-white text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-300">
                    You've successfully subscribed to our newsletter. 
                    Check your inbox for a confirmation email.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: 'fas fa-newspaper',
                title: 'Weekly Updates',
                description: 'Get the latest tech news and insights delivered every week'
              },
              {
                icon: 'fas fa-lightbulb',
                title: 'Expert Tips',
                description: 'Exclusive tips and best practices from our technology experts'
              },
              {
                icon: 'fas fa-gift',
                title: 'Exclusive Content',
                description: 'Access to premium content and early updates on new services'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-400/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <i className={`${feature.icon} text-lime-400 text-2xl`}></i>
                </motion.div>
                <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
