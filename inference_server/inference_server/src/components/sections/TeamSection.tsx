import React from 'react';
import { motion } from 'framer-motion';
import thangImg from "../img/z6865332856969_6a1361d089e0e92c216e9634a7c4677f.jpg";


const teamMembers = [
  {
    id: 1,
    name: ' Pham Trung Thang ',
    position: ' Developer ',
    image: thangImg,  
    bio: 'Develop the entire process and project including hardware, AI integration, database management, frontend and backend.',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  }
];

export default function TeamSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://techxen.vercel.app/assets/img/bg/team-bg.png')] bg-center bg-no-repeat bg-cover"></div>
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
            Our Team
          </motion.span>
          
          <motion.h2 
            className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            The person who carried out this project
            <br />
            <span className="text-lime-400">Pham Trung Thang</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Complete everything from IOT products, health assistants and websites
          </motion.p>
        </motion.div>
        
      {/* Team Grid */}
      <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            className="group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-lime-400 transition-all duration-300">
              
              {/* Image */}
              <div className="relative h-96 flex items-center justify-center overflow-hidden">
                <motion.img 
                  src={member.image} 
                  alt={member.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  whileHover={{ scale: 1.05 }}
                />



                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Social Links */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 20 }}
                  whileInView={{ y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {Object.entries(member.social).map(([platform, url]) => (
                    <motion.a
                      key={platform}
                      href={url}
                      className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className={`fab fa-${platform}`}></i>
                    </motion.a>
                  ))}
                </motion.div>
              </div>


                
                {/* Content */}
                <div className="p-6 text-center">
                  <motion.h3 
                    className="text-white text-xl font-bold mb-2 group-hover:text-lime-400 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {member.name}
                  </motion.h3>
                  
                  <p className="text-lime-400 font-semibold mb-3">
                    {member.position}
                  </p>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
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
            href="/team"
            className="bg-lime-400 text-black font-bold px-8 py-4 rounded-full hover:bg-lime-500 transition-all duration-300 inline-flex items-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Meet Full Team
            <i className="fas fa-arrow-right ml-2 transform group-hover:-rotate-45 transition-transform duration-300"></i>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
