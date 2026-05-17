import React from 'react';
import { Zap, Shield, Award, QrCode, Phone, Star } from 'lucide-react';

const Hero = ({ setActiveTab, invoices = [], currentUser }) => {
  const totalProjects = invoices.length + 150; // Base count + actual records
  const happyClients = new Set(invoices.map(inv => inv.customerPhone)).size + 142;

  return (
    <div className="relative py-12 md:py-24 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 blur-[120px] -z-10 animate-pulse delay-700"></div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-xs font-black uppercase tracking-widest animate-bounce">
            <Zap size={14} fill="currentColor" /> Certified Specialist
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            {currentUser ? (
              <>
                HELLO, <br />
                <span className="gold-text-gradient uppercase">{currentUser.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                SOHAIL <br />
                <span className="gold-text-gradient">MULANI</span>
              </>
            )}
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Leading Electrical Engineering & Smart Home Solutions in Nashik.
            Delivering excellence in every wire with 10+ years of trust.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-5 px-10 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)] hover:-translate-y-1 active:translate-y-0 text-sm uppercase tracking-widest"
            >
              Our Services
            </button>
            <div className="flex items-center gap-4 px-6 border-l border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold text-yellow-500">
                    S.M
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-black text-sm">{totalProjects}+ Projects</p>
                <div className="flex gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Business Card QR */}
        <div className="flex-1 w-full max-w-md">
          <div className="glass p-8 rounded-[3rem] border border-white/10 relative group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform">
               <QrCode size={24} />
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-48 h-48 bg-white p-3 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://wa.me/917498045041?text=${encodeURIComponent("Respected Sohail... I want to talk about your service..")}`)}&bgcolor=ffffff`}
                  alt="Contact QR"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 border-2 border-yellow-500/20 rounded-[2rem]"></div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Scan to Connect</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Direct WhatsApp Access</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-2xl font-black text-yellow-500">{totalProjects}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Works Done</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-2xl font-black text-green-500">{happyClients}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Happy Clients</p>
                </div>
              </div>

              <a href="tel:7498045041" className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all">
                <Phone size={16} className="text-yellow-500" /> Call Sohail Mulani
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <FeatureCard
          icon={<Zap className="text-yellow-500" size={32} />}
          title="Fast Service"
          description="Quick response time for all your electrical emergencies and wiring needs."
        />
        <FeatureCard
          icon={<Shield className="text-yellow-500" size={32} />}
          title="Certified Expert"
          description="Professional and licensed electrician with over a decade of hands-on experience."
        />
        <FeatureCard
          icon={<Award className="text-yellow-500" size={32} />}
          title="Premium Quality"
          description="We use only branded materials (Finolex, Polycab) for your long-term safety."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-yellow-500/30 transition-all duration-300 group">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm font-medium leading-relaxed">{description}</p>
  </div>
);

export default Hero;
