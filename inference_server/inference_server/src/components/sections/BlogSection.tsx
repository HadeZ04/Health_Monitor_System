import React from 'react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Cloud Computing: Trends to Watch in 2024',
    excerpt: 'Explore the latest trends in cloud computing and how they will shape the future of business technology.',
    image: 'https://techxen.vercel.app/assets/img/blog/blog1.jpg',
    author: 'John Anderson',
    date: 'March 15, 2024',
    category: 'Cloud Computing',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Cybersecurity Best Practices for Small Businesses',
    excerpt: 'Essential cybersecurity measures every small business should implement to protect their digital assets.',
    image: 'https://techxen.vercel.app/assets/img/blog/blog2.jpg',
    author: 'Sarah Mitchell',
    date: 'March 12, 2024',
    category: 'Cybersecurity',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'AI and Machine Learning in Business: A Practical Guide',
    excerpt: 'How artificial intelligence and machine learning are transforming business operations across industries.',
    image: 'https://techxen.vercel.app/assets/img/blog/blog3.jpg',
    author: 'Michael Chen',
    date: 'March 10, 2024',
    category: 'AI & ML',
    readTime: '6 min read'
  }
];

export default function BlogSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Shape */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://techxen.vercel.app/assets/img/bg/bottom-shape2.png')] bg-center bg-no-repeat bg-contain"></div>
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
            Our Blog
          </motion.span>
          
          <motion.h2 
            className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Latest Insights &
            <br />
            <span className="text-lime-400">Technology Trends</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Stay updated with the latest technology trends, best practices, and insights 
            from our team of experts.
          </motion.p>
        </motion.div>
        
        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-lime-400 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-lime-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Read Time */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {post.readTime}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                  
                  {/* Title */}
                  <motion.h3 
                    className="text-white font-bold text-xl mb-3 group-hover:text-lime-400 transition-colors duration-300 line-clamp-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    {post.title}
                  </motion.h3>
                  
                  {/* Excerpt */}
                  <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  {/* Read More */}
                  <motion.div 
                    className="flex items-center text-lime-400 font-semibold group-hover:text-white transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Read More
                    <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/blog"
            className="bg-lime-400 text-black font-bold px-8 py-4 rounded-full hover:bg-lime-500 transition-all duration-300 inline-flex items-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Articles
            <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
