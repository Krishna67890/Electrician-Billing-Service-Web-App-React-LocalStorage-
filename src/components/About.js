import React from 'react';
import { User, Code, Zap, Shield, Info, ExternalLink, Github, Instagram } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          Behind <span className="gold-text-gradient">Mulani Electricals</span>
        </h2>
        <div className="w-32 h-2 gold-gradient mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Profile: Sohail Mulani */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 hover:border-yellow-500/20 transition-all group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-[2rem] bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all shrink-0">
              <User size={64} className="text-yellow-500" />
            </div>
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">
                Founder & Specialist
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Sohail Mulani</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">
                With over a decade of experience in the electrical industry, Sohail Mulani has established himself as a trusted name in Nashik. Specializing in high-end house wiring, smart home automation, and industrial electrical solutions, his mission is to provide safe, efficient, and modern electrical systems for every home and business.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Shield size={16} className="text-yellow-500" /> Government Licensed
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Zap size={16} className="text-yellow-500" /> 10+ Years Exp.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer: Krishna Patil Rajput */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 hover:border-yellow-500/20 transition-all group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-[2rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all shrink-0">
              <Code size={64} className="text-blue-500" />
            </div>
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
                Lead Developer
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Krishna Patil Rajput</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">
                A passionate software engineer specializing in building premium business management platforms. Krishna designed this application to streamline Mulani Electricals' operations, combining modern UI/UX with robust financial tracking and customer engagement tools.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-pink-500">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Website Info */}
      <div className="mt-12 glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-yellow-500/20 rounded-2xl">
            <Info className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Platform Innovation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Digital Presence</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              A dynamic storefront that showcases professional services with real-time portfolio updates from recently completed projects.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Smart Billing</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Automated invoice generation with integrated UPI QR payments and dual-path WhatsApp sharing for seamless communication.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Data Sovereignty</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Built with local-first technology, ensuring business data remains private and accessible without the need for expensive cloud servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
