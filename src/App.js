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
import { DEFAULT_SERVICES, DEFAULT_PRODUCTS } from './constants';
import { Phone, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';

// Define Logo Utility outside the component to ensure it's always ready
const BrandLogo = ({ size = 40, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-full h-full bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
      <img
        src="/website%20logo.jpeg"
        alt="Logo"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display='none';
          if(e.target.nextSibling) e.target.nextSibling.style.display='block';
        }}
      />
      <Zap className="text-black hidden" size={size * 0.6} fill="currentColor" />
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem('surname_voice_enabled') === 'true';
    } catch { return false; }
  });

  // --- Voice Assistant Core ---
  const speak = useCallback((text) => {
    if (!isVoiceEnabled || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Voice suppressed");
    }
  }, [isVoiceEnabled]);

  // --- Authentication & Session Management ---
  useEffect(() => {
    const sessionUser = localStorage.getItem('surname_current_user');
    if (sessionUser) {
      const parsed = JSON.parse(sessionUser);
      setCurrentUser(parsed);
      setIsAdmin(parsed.role === 'admin');
    } else {
      setActiveTab('login');
    }

    // Load Data
    const storedInvoices = localStorage.getItem('electrician_invoices');
    if (storedInvoices) setSavedInvoices(JSON.parse(storedInvoices));

    const storedServices = localStorage.getItem('electrician_services');
    if (storedServices) setServices(JSON.parse(storedServices));

    const storedProducts = localStorage.getItem('electrician_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  // --- Voice State Persistence ---
  useEffect(() => {
    localStorage.setItem('surname_voice_enabled', isVoiceEnabled);
  }, [isVoiceEnabled]);

  // --- Tab Voice Logic ---
  useEffect(() => {
    if (isVoiceEnabled && currentUser && activeTab !== 'login') {
      const guidance = {
        home: "Welcome to Surname Electricians Dashboard.",
        billing: "Generate a new invoice now.",
        history: "Reviewing your transaction records.",
        admin: "Website controls active.",
        about: "The story of Surname Electricians."
      };
      speak(guidance[activeTab] || "");
    }
  }, [activeTab, isVoiceEnabled, currentUser, speak]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('surname_current_user', JSON.stringify(user));
    setActiveTab('home');
    if (isVoiceEnabled) speak(`Welcome ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('surname_current_user');
    setActiveTab('login');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
        <div className="mb-10 text-center animate-in fade-in zoom-in duration-700">
          <BrandLogo size={60} className="w-24 h-24 mx-auto mb-6 rotate-3" />
          <h1 className="text-4xl font-black gold-text-gradient uppercase tracking-tighter">Surname Electricians</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Secure Business Portal</p>
        </div>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* ULTRA-MEGA SCALE PERSISTENT SALE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 text-white py-16 px-6 text-center border-b-[16px] border-yellow-500 sticky top-0 z-[100] shadow-[0_40px_150px_rgba(0,0,0,1)] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-6 bg-yellow-400 text-black px-10 py-3 rounded-full text-lg font-black uppercase tracking-[0.6em] animate-bounce shadow-[0_0_50px_rgba(234,179,8,0.7)] mb-10">
              <Zap size={32} fill="currentColor" /> PLATFORM FOR SALE <Zap size={32} fill="currentColor" />
            </div>

            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-10 text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
              THIS WEBSITE IS <br/>
              <span className="text-yellow-400 drop-shadow-[0_0_40px_rgba(234,179,8,0.5)]">FOR SALE</span>
            </h1>

            <div className="flex flex-col lg:flex-row items-center gap-16 bg-black/60 backdrop-blur-2xl p-12 rounded-[4rem] border-4 border-white/20 shadow-2xl max-w-7xl w-full">
              <div className="flex-1 text-center lg:text-left">
                <p className="text-blue-300 text-xl font-black uppercase tracking-[0.4em] mb-6">Contact the Developer Immediately:</p>
                <a
                  href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-5xl md:text-8xl font-black text-white hover:text-yellow-400 transition-all hover:scale-105 inline-block underline decoration-yellow-400 decoration-8 underline-offset-[20px]"
                >
                  @krish_root_labs
                </a>
              </div>

              <div className="hidden lg:block w-px h-48 bg-white/30"></div>

              <div className="text-center">
                <p className="text-yellow-400 text-8xl md:text-[10rem] font-black leading-none mb-4">₹1,000</p>
                <p className="text-2xl font-black text-white uppercase tracking-[0.5em]">Fixed Price • Full Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Voice Toggle */}
      <button
        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        className={`fixed bottom-8 left-8 z-[60] p-4 rounded-2xl shadow-2xl transition-all border border-white/10 ${isVoiceEnabled ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white backdrop-blur-xl'}`}
      >
        {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} currentUser={currentUser} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'billing' && (
          <BillingForm
            onSave={(inv) => {
              const invoiceWithUser = { ...inv, userId: currentUser?.id };
              const updated = [invoiceWithUser, ...savedInvoices];
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              setSelectedInvoice(invoiceWithUser);
              setActiveTab('preview');
              speak("Bill saved.");
            }}
            catalog={[
              ...products,
              ...services.map(s => ({
                id: s.id,
                name: s.title,
                rate: parseFloat(s.price) || 0,
                isService: true
              }))
            ]}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* ULTRA-PROMINENT SALE BANNER */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 border-y-4 border-white py-12 px-4 text-center shadow-[0_0_100px_rgba(37,99,235,0.6)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="relative z-10 max-w-5xl mx-auto">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 animate-pulse leading-none">
                  THIS WEBSITE IS <span className="text-yellow-400">FOR SALE</span>
                </h2>
                <p className="text-xl md:text-3xl font-bold text-blue-100 mb-8 uppercase tracking-widest">
                  Professional Billing & Management Platform
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                    <p className="text-blue-300 text-xs font-black uppercase tracking-widest mb-1">Contact Developer</p>
                    <a
                      href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl md:text-5xl font-black text-white hover:text-yellow-400 transition-colors"
                    >
                      @krish_root_labs
                    </a>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-6xl md:text-8xl font-black text-yellow-400">₹1,000</span>
                    <span className="text-sm font-black text-white uppercase tracking-[0.5em]">Fixed Price</span>
                  </div>
                </div>
              </div>
            </div>

            <Hero
              setActiveTab={setActiveTab}
              invoices={savedInvoices.filter(inv => inv.status !== 'Request')}
              currentUser={currentUser}
            />

            {/* Premium Sale Details Section */}
            <section className="glass p-8 md:p-12 rounded-[3rem] border border-blue-500/30 bg-blue-600/5 relative overflow-hidden sale-glow">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block animate-bounce">Special Offer</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-white uppercase tracking-tighter leading-none text-glow-blue">
                  GET THIS FULL WEBSITE <br/>
                  <span className="text-blue-400 text-2xl md:text-3xl tracking-normal italic font-bold">FOR ONLY ₹1,000</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
                  {['Secure Admin Panel', 'WhatsApp Billing', 'PDF Generation', 'Voice Assistant'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-200 uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5">
                      <Zap size={14} className="text-blue-500 flex-shrink-0" /> {feature}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium italic">
                  Complete professional billing & storefront system. Ready to deploy. I will update all branding (Name, Logo, QR, Contact) for the new owner upon purchase.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95">
                    DM ON INSTAGRAM TO BUY
                  </a>
                </div>
              </div>
            </section>

            <Services
              services={services}
              currentUser={currentUser}
              invoices={savedInvoices}
              onInquiry={(inquiry) => {
                const updated = [inquiry, ...savedInvoices];
                setSavedInvoices(updated);
                localStorage.setItem('electrician_invoices', JSON.stringify(updated));
                speak("Order request sent to WhatsApp.");
                setActiveTab('history');
              }}
            />

            <section className="glass p-8 rounded-[2.5rem] text-center border-yellow-500/20">
              <h2 className="text-3xl font-black mb-4 gold-text-gradient uppercase tracking-tighter">24/7 Professional Service</h2>
              <a href="tel:7498045041" className="inline-flex bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-10 rounded-2xl transition-all items-center gap-3">
                <Phone size={20} /> CALL FOR SERVICE
              </a>
              <p className="mt-6 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Website Development & Ownership:
                <a href="https://www.instagram.com/krish_root_labs?igsh=YWczM2t3amUyZ3lp" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-400 underline transition-colors">
                  Contact @krish_root_labs
                </a>
              </p>
            </section>
          </div>
        )}


        {activeTab === 'history' && (
          <SavedBills
            invoices={isAdmin ? savedInvoices : savedInvoices.filter(i => i.userId === currentUser.id)}
            onView={(inv) => { setSelectedInvoice(inv); setActiveTab('preview'); }}
            isAdmin={isAdmin}
            onToggleStatus={(id) => {
              const updated = savedInvoices.map(inv => {
                if (inv.id !== id) return inv;
                let nextStatus;
                if (inv.status === 'Request' || inv.status === 'Inquiry') nextStatus = 'Pending';
                else if (inv.status === 'Pending') nextStatus = 'Paid';
                else nextStatus = 'Pending';
                return { ...inv, status: nextStatus };
              });
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              const current = updated.find(i => i.id === id);
              speak(`Status updated to ${current.status}`);
            }}
            onDelete={(id) => {
              const updated = savedInvoices.filter(i => i.id !== id);
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === 'preview' && selectedInvoice && (
          <InvoicePreview
            invoice={selectedInvoice}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
            onUpdateStatus={(id, status) => {
              const updated = savedInvoices.map(inv =>
                inv.id === id ? { ...inv, status } : inv
              );
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
              setSelectedInvoice(prev => ({ ...prev, status }));
              speak(`Status updated to ${status}`);
            }}
            onDelete={(id) => {
              const updated = savedInvoices.filter(i => i.id !== id);
              setSavedInvoices(updated);
              localStorage.setItem('electrician_invoices', JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === 'about' && <About />}

        {activeTab === 'dashboard' && isAdmin && (
          <Dashboard invoices={savedInvoices} />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminServices
            services={services}
            onUpdate={(s) => { setServices(s); localStorage.setItem('electrician_services', JSON.stringify(s)); }}
            products={products}
            onUpdateProducts={(p) => { setProducts(p); localStorage.setItem('electrician_products', JSON.stringify(p)); }}
            invoices={savedInvoices}
            onUpdateInvoices={(inv) => { setSavedInvoices(inv); localStorage.setItem('electrician_invoices', JSON.stringify(inv)); }}
          />
        )}
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">
        © {new Date().getFullYear()} Surname Electricians | Nashik
      </footer>
    </div>
  );
}

export default App;
