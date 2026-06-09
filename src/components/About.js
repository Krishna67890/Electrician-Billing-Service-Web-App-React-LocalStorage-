import React from 'react';
import { User, Code, Zap, Shield, Info, Github, Instagram } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          Behind <span className="gold-text-gradient">Surname Electricians</span>
        </h2>
        <div className="w-32 h-2 gold-gradient mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Profile: Surname Electricians */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 hover:border-yellow-500/20 transition-all group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-[2rem] bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all shrink-0">
              <Zap size={64} className="text-yellow-500" />
            </div>
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">
                Professional Services
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Surname Electricians</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">
                With over a decade of experience in the electrical industry, Surname Electricians has established itself as a trusted name in Nashik. Specializing in high-end house wiring, smart home automation, and industrial electrical solutions, our mission is to provide safe, efficient, and modern electrical systems for every home and business.
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

        {/* Developer: Krishna Root Labs */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-blue-500/30 bg-blue-600/5 transition-all group scale-105 shadow-[0_20px_50px_rgba(37,99,235,0.2)] sale-glow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-[2rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all shrink-0">
              <Code size={64} className="text-blue-500" />
            </div>
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse">
                Website For Sale
              </div>
              <h3 className="text-3xl font-black mb-1 uppercase tracking-tight text-glow-blue">Krishna Root Labs</h3>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Pricing: ₹1,000 Only</p>
              <p className="text-gray-400 font-medium leading-relaxed mb-6">
                This platform is currently available for purchase. If you are a business owner looking for a professional billing and storefront system, contact the developer below. Full customization and setup support provided.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95">
                  <Instagram size={20} /> DM TO BUY
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
