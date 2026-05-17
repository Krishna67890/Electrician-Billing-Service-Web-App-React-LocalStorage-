import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BillingForm from './components/BillingForm';
import SavedBills from './components/SavedBills';
import InvoicePreview from './components/InvoicePreview';
import Login from './components/Login';
import AdminServices from './components/AdminServices';
import Dashboard from './components/Dashboard';
import About from './components/About';
import { Phone, MapPin, ShieldCheck, LogOut, Volume2, VolumeX, Info, Trash2 } from 'lucide-react';

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "House Wiring",
    description: "Complete house wiring for new and old constructions with premium finishing.",
    price: "15000",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Smart Home Setup",
    description: "Installation of smart switches, Alexa integration, and automated lighting.",
    price: "5000",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Inverter & Meter Work",
    description: "New inverter installation and official meter shifting services.",
    price: "1200",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
  }
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Fan Fitting", rate: 250 },
  { id: 2, name: "LED Panel Light Fitting", rate: 150 },
  { id: 3, name: "Switch Board Repairing", rate: 200 },
  { id: 4, name: "Inverter Service", rate: 500 },
  { id: 5, name: "Main Meter Fitting", rate: 1200 },
  { id: 6, name: "Kitchen Chimney Cleaning", rate: 800 },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    return localStorage.getItem('mulani_voice_enabled') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mulani_voice_enabled', isVoiceEnabled);
    if (isVoiceEnabled) {
      speak("Voice assistant is now active.");
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled, speak]);

  useEffect(() => {
    // Load User Session
    const loggedInUser = localStorage.getItem('mulani_current_user');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    } else {
      setActiveTab('login');
    }

    // Load Data
    const storedInvoices = localStorage.getItem('electrician_invoices');
    if (storedInvoices) setSavedInvoices(JSON.parse(storedInvoices));

    const storedServices = localStorage.getItem('electrician_services');
    if (storedServices) setServices(JSON.parse(storedServices));
    else localStorage.setItem('electrician_services', JSON.stringify(DEFAULT_SERVICES));

    const storedProducts = localStorage.getItem('electrician_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    else localStorage.setItem('electrician_products', JSON.stringify(DEFAULT_PRODUCTS));

    if (!localStorage.getItem('admin_email')) {
      localStorage.setItem('admin_email', 'mh15sohail@gmail.com');
      localStorage.setItem('admin_password', '16301003');
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('mulani_current_user', JSON.stringify(user));
    setActiveTab('home');
    if (isVoiceEnabled) speak(`Welcome back ${user.name || 'User'}. You have successfully logged into the Mulani Electricals portal.`);
  };

  const handleLogout = () => {
    if (isVoiceEnabled) speak("Logging out. Thank you for using Mulani Electricals. Have a safe day.");
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mulani_current_user');
    setActiveTab('login');
  };

  const updateServices = (newServices) => {
    try {
      setServices(newServices);
      localStorage.setItem('electrician_services', JSON.stringify(newServices));
    } catch (e) {
      alert("Storage limit reached! Try removing some images or old invoices.");
      console.error("LocalStorage Error:", e);
    }
  };

  const updateProducts = (newProducts) => {
    try {
      setProducts(newProducts);
      localStorage.setItem('electrician_products', JSON.stringify(newProducts));
    } catch (e) {
      alert("Storage limit reached!");
      console.error("LocalStorage Error:", e);
    }
  };

  const saveInvoice = (invoice) => {
    try {
      // Add user ID to invoice for filtering
      const invoiceWithUser = { ...invoice, userId: currentUser?.id || 'guest' };
      const updated = [invoiceWithUser, ...savedInvoices];
      setSavedInvoices(updated);
      localStorage.setItem('electrician_invoices', JSON.stringify(updated));
      setSelectedInvoice(invoiceWithUser);
      setActiveTab('preview');
      if (isVoiceEnabled) speak("Invoice saved successfully. You can now preview, print or share it as a P D F.");
    } catch (e) {
      alert("Could not save invoice. Local storage is full.");
      console.error("LocalStorage Error:", e);
    }
  };

  const toggleInvoiceStatus = (id) => {
    try {
      const updated = savedInvoices.map(inv =>
        inv.id === id ? { ...inv, status: inv.status === 'Paid' ? 'Pending' : 'Paid' } : inv
      );
      setSavedInvoices(updated);
      localStorage.setItem('electrician_invoices', JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage Error:", e);
    }
  };

  const deleteInvoice = (id) => {
    try {
      const updated = savedInvoices.filter(inv => inv.id !== id);
      setSavedInvoices(updated);
      localStorage.setItem('electrician_invoices', JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage Error:", e);
    }
  };

  const updateInvoices = (newInvoices) => {
    try {
      setSavedInvoices(newInvoices);
      localStorage.setItem('electrician_invoices', JSON.stringify(newInvoices));
    } catch (e) {
      alert("Storage limit reached!");
      console.error("LocalStorage Error:", e);
    }
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('preview');
  };

  const speak = useCallback((text) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  useEffect(() => {
    if (isVoiceEnabled) {
      const messages = {
        home: "I am your assistant of this Mulani Electricians website. Welcome to our premium electrical services hub in Nashik. We specialize in house wiring and smart home setups.",
        billing: "Welcome to the Billing Section. I am here to help you generate professional invoices. You can select items from our catalog or enter custom work details.",
        history: "You are now viewing the Records. Here you can track all your past invoices, check payment statuses, and manage your financial history securely.",
        about: "Meet our expert team. Sohail Mulani, our founder with over 10 years of experience, and Krishna Patil Rajput, our lead developer who built this advanced platform.",
        dashboard: "Admin Dashboard Access. I am providing you with a high-level overview of your business performance, total revenue, and project analytics.",
        admin: "Website Management Portal. Here you can update your service listings, modify product prices, and maintain the live storefront portfolio.",
        login: "Secure Access Portal. Please identify yourself to enter the Mulani Electricians management system. Safety and privacy are our top priorities."
      };
      speak(messages[activeTab] || "");
    }
  }, [activeTab, isVoiceEnabled, speak]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
        <header className="py-12 text-center">
           <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-3xl rotate-3 shadow-2xl">
                <ShieldCheck className="text-black" size={40} strokeWidth={3} />
              </div>
           </div>
           <h1 className="text-5xl font-black gold-text-gradient tracking-tighter uppercase">Mulani Electricals</h1>
           <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">Professional Business Portal</p>
        </header>
        <Login onLogin={handleLogin} />
        <footer className="mt-auto py-10 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} Sohail Mulani | Secure Management System
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
      {/* Voice Control Floating Button */}
      <button
        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        className={`fixed bottom-8 left-8 z-[60] p-4 rounded-2xl transition-all shadow-2xl flex items-center gap-2 group ${isVoiceEnabled ? 'bg-yellow-500 text-black scale-110' : 'bg-white/10 text-white backdrop-blur-xl'}`}
        title={isVoiceEnabled ? "Disable Voice Assistant" : "Enable Voice Assistant"}
      >
        {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-black uppercase tracking-widest whitespace-nowrap">
          {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
        </span>
      </button>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} invoices={savedInvoices} currentUser={currentUser} />
            <Services services={services} />

            {/* Live Portfolio - Shows only types of work done (Privacy Safe) */}
            <section className="py-20 border-t border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">
                    Recent <span className="gold-text-gradient">Project Success</span>
                  </h2>
                  <p className="text-gray-500 mt-2 font-medium">Real-time updates of recently completed works across Nashik</p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  Live Updates
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedInvoices.filter(inv => inv.status === 'Paid').slice(0, 4).map((inv, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group relative">
                    {isAdmin && (
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                        title="Delete from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Completed</p>
                    <h4 className="font-bold text-white group-hover:text-yellow-500 transition-colors truncate">
                      {inv.items[0]?.name || "Electrical Work"}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">{inv.date}</p>
                  </div>
                ))}
                {savedInvoices.filter(inv => inv.status === 'Paid').length === 0 && (
                   <div className="col-span-full py-12 text-center glass rounded-3xl border border-dashed border-white/10">
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Waiting for first project completion...</p>
                   </div>
                )}
              </div>
            </section>
            <section className="mt-16 glass p-8 rounded-[2.5rem] text-center border-yellow-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl -z-10 group-hover:bg-yellow-500/20 transition-all duration-700"></div>
              <h2 className="text-3xl font-black mb-4 gold-text-gradient uppercase tracking-tighter">24/7 Emergency Service Available</h2>
              <p className="text-gray-400 mb-6 uppercase tracking-[0.3em] text-xs font-bold">Expert Solutions • Guaranteed Safety</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:7498045041" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-10 rounded-2xl transition-all flex items-center gap-3 shadow-[0_10px_20px_-5px_rgba(234,179,8,0.3)] hover:scale-105">
                  <Phone size={20} /> CALL SOHAIL
                </a>
                <a href={`https://wa.me/917498045041?text=${encodeURIComponent(
                  "*EMERGENCY ASSISTANCE REQUESTED*\n" +
                  "--------------------------\n" +
                  "Respected Sohail... I want to talk about your service.. I need urgent electrical assistance."
                )}`} target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-10 rounded-2xl transition-all flex items-center gap-3 shadow-[0_10px_20px_-5px_rgba(22,163,74,0.3)] hover:scale-105">
                  WHATSAPP NOW
                </a>
              </div>
            </section>
          </>
        )}

        {activeTab === 'dashboard' && isAdmin && (
          <Dashboard invoices={savedInvoices} />
        )}

        {activeTab === 'billing' && (
          <BillingForm onSave={saveInvoice} catalog={products} />
        )}

        {activeTab === 'history' && (
          <SavedBills
            invoices={isAdmin ? savedInvoices : savedInvoices.filter(inv => inv.userId === currentUser?.id)}
            onView={viewInvoice}
            onToggleStatus={toggleInvoiceStatus}
            onDelete={deleteInvoice}
          />
        )}

        {activeTab === 'preview' && selectedInvoice && (
          <div className="max-w-4xl mx-auto">
             {isVoiceEnabled && (
               <div className="hidden">
                 {(() => {
                    speak("Now showing the invoice preview. You can review the items, total amount, and professional branding before finalization.");
                    return null;
                 })()}
               </div>
             )}
             <button
              onClick={() => setActiveTab('history')}
              className="mb-6 text-yellow-500 hover:text-white flex items-center gap-2 no-print font-bold transition-all group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO HISTORY
            </button>
            <InvoicePreview
              invoice={selectedInvoice}
              onDelete={deleteInvoice}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'about' && <About />}

        {activeTab === 'login' && <Login onLogin={handleLogin} />}

        {activeTab === 'admin' && isAdmin && (
          <AdminServices
            services={services}
            onUpdate={updateServices}
            products={products}
            onUpdateProducts={updateProducts}
            invoices={savedInvoices}
            onUpdateInvoices={updateInvoices}
          />
        )}
      </main>

      <footer className="mt-auto py-12 border-t border-gray-900 bg-black/40 no-print backdrop-blur-sm">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-yellow-500 mb-6 tracking-tighter uppercase">Mulani Electricals</h3>
            <p className="text-gray-400 font-medium leading-relaxed">Providing high-end electrical solutions in Nashik. We prioritize safety and modern aesthetics.</p>
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => setActiveTab('about')}
                className="flex items-center gap-2 text-yellow-500/70 hover:text-yellow-500 text-xs font-black uppercase tracking-widest transition"
              >
                <Info size={16} /> About The Team
              </button>
              {isAdmin ? (
                 <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-widest transition group">
                  <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> LOGOUT SESSION
                 </button>
              ) : (
                <button onClick={() => setActiveTab('login')} className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 text-xs font-black uppercase tracking-widest transition">
                  <ShieldCheck size={16} /> SECURE ADMIN ACCESS
                </button>
              )}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-6 text-gray-500">Contact Details</h4>
            <ul className="text-gray-300 space-y-4">
              <li className="flex items-center justify-center md:justify-start gap-3 group cursor-pointer">
                <div className="bg-yellow-500/10 p-2 rounded-lg group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <Phone size={18} />
                </div>
                <span className="font-bold">7498045041</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 group cursor-pointer">
                <div className="bg-yellow-500/10 p-2 rounded-lg group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <MapPin size={18} />
                </div>
                <span className="font-bold">Nashik, Maharashtra</span>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-6 text-gray-500">Professionalism</h4>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Licensed', '24/7 Service', 'Quality Parts', 'Warranty'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-500 font-medium italic">"Bringing light to your life since 2015."</p>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-700 text-[10px] font-black uppercase tracking-[0.4em] border-t border-gray-900/50 pt-10">
          © {new Date().getFullYear()} Sohail Mulani | Developed for Premium Business Operations
        </div>
      </footer>
    </div>
  );
}

export default App;
