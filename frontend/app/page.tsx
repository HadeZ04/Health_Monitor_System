"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0B0F17] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar Placeholder */}

      {/* HERO SECTION (New Design) */}
      <section className="relative pt-20 lg:pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">Live Monitoring System</span>
              </div>

              <h1 className="text-6xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8">
                See every <span className="text-cyan-400">vital sign</span> your patient generates.
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
                Connect your medical devices, EHRs, and patient data once. TechXen discovers every anomaly, predicts risks, and spots critical trends before they become emergencies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all transform hover:-translate-y-1">
                  <span className="material-symbols-outlined mr-2 text-xl">grid_view</span>
                  Book a 20-minute demo
                </Link>
                <Link href="/auth/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-800 rounded-full hover:bg-slate-700 transition-all transform hover:-translate-y-1 border border-slate-700">
                  <span className="material-symbols-outlined mr-2 text-xl">check_circle</span>
                  Start free trial
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-800/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F17] bg-slate-700 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">Trusted by medical teams worldwide.</p>
                  <p className="text-slate-500">3,900+ critical alerts caught early.</p>
                </div>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-xs text-slate-500 font-medium">
                 <span className="flex items-center gap-1"><div className="w-1 h-1 bg-slate-500 rounded-full"></div> Bank-grade security</span>
                 <span className="flex items-center gap-1"><div className="w-1 h-1 bg-slate-500 rounded-full"></div> HIPAA Compliant</span>
                 <span className="flex items-center gap-1"><div className="w-1 h-1 bg-slate-500 rounded-full"></div> 99.9% Uptime</span>
              </div>
            </motion.div>

            {/* Right Visuals - Dashboard Composition */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="grid gap-6">
                 {/* Main Card */}
                 <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-2xl"
                 >
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <h3 className="text-3xl font-bold text-white mb-1">Patient Vitals</h3>
                          <p className="text-slate-400">ICU Wing A • Bed 04</p>
                       </div>
                       <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-cyan-400">ecg_heart</span>
                       </div>
                    </div>
                    <div className="h-32 w-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl border border-slate-700/30 relative overflow-hidden mb-6">
                       {/* Fake Chart Line */}
                       <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path d="M0,64 Q40,30 80,64 T160,64 T240,40 T320,80 T400,64 T480,50 T560,70 T640,64 V128 H0 Z" fill="url(#grad1)" opacity="0.2" />
                          <path d="M0,64 Q40,30 80,64 T160,64 T240,40 T320,80 T400,64 T480,50 T560,70 T640,64" stroke="#22d3ee" strokeWidth="3" fill="none" />
                          <defs>
                             <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                             </linearGradient>
                          </defs>
                       </svg>
                    </div>
                    <div className="flex gap-4">
                       <div className="bg-slate-800 rounded-xl px-4 py-2 flex-1 border border-slate-700">
                          <p className="text-xs text-slate-400">Heart Rate</p>
                          <p className="text-xl font-bold text-white">78 <span className="text-xs font-normal text-slate-500">BPM</span></p>
                       </div>
                       <div className="bg-slate-800 rounded-xl px-4 py-2 flex-1 border border-slate-700">
                          <p className="text-xs text-slate-400">SpO2</p>
                          <p className="text-xl font-bold text-white">98 <span className="text-xs font-normal text-slate-500">%</span></p>
                       </div>
                       <div className="bg-slate-800 rounded-xl px-4 py-2 flex-1 border border-slate-700">
                          <p className="text-xs text-slate-400">BP</p>
                          <p className="text-xl font-bold text-white">120/80</p>
                       </div>
                    </div>
                 </motion.div>

                 <div className="grid grid-cols-2 gap-6">
                    {/* Secondary Card */}
                    <motion.div 
                       whileHover={{ scale: 1.02 }}
                       className="p-6 rounded-[2rem] bg-black border border-slate-800 relative overflow-hidden group"
                    >
                       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217358c7be61?q=80&w=2070')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                       <div className="relative z-10 h-full flex flex-col justify-end">
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
                             <span className="material-symbols-outlined text-white">watch</span>
                          </div>
                          <h4 className="text-lg font-bold text-white">IoT Connected</h4>
                          <p className="text-sm text-slate-400">Real-time sync with wearables</p>
                       </div>
                    </motion.div>

                    {/* Third Card */}
                    <motion.div 
                       whileHover={{ scale: 1.02 }}
                       className="p-6 rounded-[2rem] bg-slate-900 border border-slate-800 flex flex-col justify-between"
                    >
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Growth Curve</span>
                          <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> +18.4%
                          </div>
                       </div>
                       
                       <div className="flex items-end justify-between gap-1 h-24 mb-4">
                          {[40, 70, 45, 90, 60, 75, 50, 80].map((h, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                className="w-full bg-cyan-500/20 rounded-t-sm hover:bg-cyan-400 transition-colors"
                             ></motion.div>
                          ))}
                       </div>
                       
                       <div>
                          <h4 className="text-white font-bold">Optimize Care</h4>
                          <p className="text-xs text-slate-500 mt-1">Focus on critical patients first.</p>
                       </div>
                    </motion.div>
                 </div>
                 
                 {/* Bottom Floating Pill */}
                 <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined">smart_toy</span>
                       </div>
                       <div>
                          <h4 className="text-white font-bold">TechXen AI</h4>
                          <p className="text-xs text-slate-400 max-w-[150px] sm:max-w-xs">Make your data move like a system.</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300">Analytics</span>
                       <span className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300">Insight</span>
                    </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION (Restored & Styled) */}
      <section className="py-24 lg:py-32 relative border-t border-slate-800/50">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-700/50" whileHover={{ scale: 1.02 }}>
                <img 
                  src="https://digitalhealth.folio3.com/wp-content/uploads/2025/01/Group-1000002931-1.png" 
                  alt="Healthcare AI" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-cyan-400 font-semibold">About TechXen</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
                The Fusion of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI and IoT</span> in Healthcare
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed">
                The Internet of Things (IoT) in healthcare refers to the integration of internet-connected devices and sensors throughout the medical field. 
                These devices collect, transmit, and analyze health data for patients and clinicians using deep learning and AI algorithms.
              </p>
              
              <div className="space-y-4">
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
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-4 group-hover:scale-125 transition-transform"></div>
                    <span className="text-slate-300 group-hover:text-white transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-8">
                 <Link href="/dashboard">
                    <motion.div
                      className="inline-flex items-center text-white font-bold px-8 py-4 rounded-full border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Launch Dashboard →
                    </motion.div>
                 </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION (Restored & Styled) */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-[2.5rem] border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/50 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
              <div className="max-w-2xl space-y-6">
                <p className="text-sm uppercase tracking-[0.4em] text-cyan-400 font-bold">Command center</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Monitoring dashboards, AI chatbot, doctors, devices & emergency rules—connected end to end.
                </h2>
                <p className="text-slate-400 text-lg">
                  Jump straight into the dashboard to explore live vitals, replay ECG, coordinate doctors, run AI consultations, and manage your IoT fleet.
                </p>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 text-sm text-slate-200 min-w-[300px]">
                <Link href="/dashboard/monitoring/live" className="rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-4 text-center hover:bg-slate-800 hover:border-cyan-500/50 transition-all">
                  Live Monitoring
                </Link>
                <Link href="/dashboard/ai-chat" className="rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-4 text-center hover:bg-slate-800 hover:border-cyan-500/50 transition-all">
                  Medical AI Chatbot
                </Link>
                <Link href="/dashboard/patients" className="rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-4 text-center hover:bg-slate-800 hover:border-cyan-500/50 transition-all">
                  Patients & Doctors
                </Link>
                <Link href="/dashboard/emergency" className="rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-4 text-center hover:bg-slate-800 hover:border-cyan-500/50 transition-all">
                  Emergency Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
