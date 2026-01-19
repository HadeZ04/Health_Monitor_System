import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'Automatic blood glucose monitoring',
    image: 'https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/679c9076e8c10a4224a55204_679c900f99e3e07f32a7f06e_Automated%2520Insulin%2520Delivery%2520Systems.png',
    description: 'Complete overhaul of legacy e-commerce system with modern cloud architecture.',
    technologies: ['React', 'Node.js', 'AWS', 'MongoDB']
  },
  {
    id: 2,
    title: 'Healthcare Data Analytics',
    category: 'Data Analytics',
    image: 'https://techxen.vercel.app/assets/img/project/project2.jpg',
    description: 'Advanced analytics platform for healthcare providers to improve patient outcomes.',
    technologies: ['Python', 'TensorFlow', 'Azure', 'PostgreSQL']
  },
  {
    id: 3,
    title: 'Financial Security System',
    category: 'Cybersecurity',
    image: 'https://techxen.vercel.app/assets/img/project/project3.jpg',
    description: 'Comprehensive security solution for financial institutions.',
    technologies: ['Java', 'Spring', 'Docker', 'Kubernetes']
  },
  {
    id: 4,
    title: 'IoT Manufacturing Solution',
    category: 'IoT Development',
    image: 'https://techxen.vercel.app/assets/img/project/project4.jpg',
    description: 'Smart manufacturing system with real-time monitoring and predictive maintenance.',
    technologies: ['C++', 'Python', 'MQTT', 'InfluxDB']
  }
];

export default function ProjectsSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.span 
              className="text-lime-400 font-bold inline-flex items-center"
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
              Our Projects
            </motion.span>
            
            <motion.h2 
              className="text-white text-3xl lg:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Highlight Projects
              <br />
              <span className="text-lime-400">I have realized</span>
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Let's take a look at some of the advantages of this project.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              {[
                { number: '500+', label: 'Projects Completed' },
                { number: '150+', label: 'Happy Clients' },
                { number: '25+', label: 'Years Experience' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-lime-400 text-2xl font-bold">{stat.number}</h4>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="/projects"
                className="bg-lime-400 text-black font-bold px-8 py-4 rounded-full hover:bg-lime-500 transition-all duration-300 inline-flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Projects
                <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right - Featured Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img 
                src="https://techxen.vercel.app/assets/img/solution/solution-img2.png" 
                alt="Solutions" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Play Button */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                  <i className="fas fa-play text-black text-xl ml-1"></i>
                </div>
              </motion.div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 bg-lime-400/20 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
        
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 group-hover:border-lime-400 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-lime-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-lime-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 2).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-gray-400 text-xs">
                        +{project.technologies.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Link */}
                  <div className="flex items-center text-lime-400 font-semibold text-sm group-hover:text-white transition-colors duration-300">
                    View Details
                    <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
