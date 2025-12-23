import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import MobileMenu from './components/layout/MobileMenu';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import ProjectsSection from './components/sections/ProjectsSection';
import TeamSection from './components/sections/TeamSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import BlogSection from './components/sections/BlogSection';
import AuthSection from './components/sections/AuthSection';
import NewsletterSection from './components/sections/NewsletterSection';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import './tailwind.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="relative text-white bg-slate-900 overflow-x-hidden font-figtree">
        {/* Enhanced Medical Tech Background */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Medical Tech Grid Overlay */}
          <div className="absolute inset-0 medical-grid-pattern opacity-20"></div>
          
          {/* DNA Helix Animation */}
          <div className="absolute inset-0 dna-helix opacity-15"></div>
          
          {/* Medical Holographic Layer */}
          <div className="absolute inset-0 medical-holographic opacity-25"></div>
          
          {/* Heartbeat Lines */}
          <div className="absolute inset-0 heartbeat-lines opacity-30"></div>
          
          {/* Medical Particles */}
          <div className="absolute inset-0 medical-particles opacity-40"></div>
        </div>
        
        <Header isScrolled={isScrolled} />
        <MobileHeader 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
        
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <TeamSection />
          <TestimonialsSection />
          <BlogSection />
          <AuthSection />
          <NewsletterSection />
        </main>
        
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
