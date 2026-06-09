import React, { useState, useEffect } from 'react';
import { Lightbulb, Wrench, Home, Zap, Settings, Thermometer, Construction, PenTool, PlusSquare, MessageSquare, CheckCircle2 } from 'lucide-react';

const iconMap = {
  "House Wiring": <Home className="text-yellow-500" />,
  "Fan & Light Fitting": <Lightbulb className="text-yellow-500" />,
  "Switch Board Repair": <Settings className="text-yellow-500" />,
  "Inverter & Meter Work": <Zap className="text-yellow-500" />,
  "Cooler & AC Repair": <Thermometer className="text-yellow-500" />,
  "Kitchen Appliances": <Wrench className="text-yellow-500" />,
  "1BHK/2BHK Wiring": <Construction className="text-yellow-500" />,
  "Industrial Fitting": <PenTool className="text-yellow-500" />,
};

const Services = ({ services, currentUser, onInquiry }) => {

  const handleInquiry = (service) => {
    if (!currentUser) return;

    // 1. Create Request Record (Auto-Generated "Bill")
    const inquiryRecord = {
      id: 'REQ-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString('en-IN'),
      timestamp: Date.now(),
      customerName: currentUser.name,
      customerPhone: '', // Filled by user later or if available in user object
      customerAddress: 'Request via Website',
      items: [{
        name: service.title,
        quantity: 1,
        rate: service.price || 0,
        amount: service.price || 0
      }],
      subtotal: service.price || 0,
      discount: 0,
      finalTotal: service.price || 0,
      status: 'Request',
      userId: currentUser.id
    };

    if (onInquiry) onInquiry(inquiryRecord);

    // 2. Generate WhatsApp Message
    const adminPhone = "917498045041";
    const message = encodeURIComponent(
      `*NEW REQUEST: ${service.title.toUpperCase()}*\n` +
      `--------------------------\n` +
      `*Customer:* ${currentUser.name}\n` +
      `*Service:* ${service.title}\n` +
      (service.price ? `*Price:* ₹${service.price}\n` : '') +
      `*Request ID:* ${inquiryRecord.id}\n` +
      `--------------------------\n` +
      `I am interested in this service. Please confirm my request.`
    );

    // 3. Open WhatsApp
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20" id="services">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
          Our <span className="gold-text-gradient">Professional Services</span>
        </h2>
        <div className="w-24 h-1.5 gold-gradient mx-auto rounded-full"></div>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto font-medium">
          Premium electrical solutions for all your requirements. Managed and executed by certified experts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          return (
            <div
              key={service.id || index}
              className="glass rounded-[2rem] hover:bg-white/10 transition-all group border border-white/5 hover:border-yellow-500/30 overflow-hidden flex flex-col"
            >
              {service.image ? (
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {service.price && (
                    <div className="absolute bottom-4 left-6 bg-yellow-500 text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                      Starts @ ₹{service.price}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 pb-0">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    {React.cloneElement(iconMap[service.title] || <PlusSquare className="text-yellow-500" />, { size: 32 })}
                  </div>
                </div>
              )}

              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-black mb-3 group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-medium mb-4">
                  {service.description || "High-quality electrical work with professional finishing and safety assurance."}
                </p>

                {service.features && (
                  <div className="space-y-2 mb-6">
                    {service.features.split('\n').filter(f => f.trim()).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {!service.image && service.price && (
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Rate:</span>
                    <span className="text-yellow-500 font-black text-lg">₹{service.price}</span>
                  </div>
                )}
              </div>

              <div className="px-8 pb-8">
                <button
                  onClick={() => handleInquiry(service)}
                  className="w-full py-4 border rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all bg-transparent text-gray-400 border-white/10 hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
                >
                  <MessageSquare size={16} /> Payment through WhatsApp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;

